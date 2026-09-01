import { run } from '../../src/commands/run';
import { InMemoryTicketStore } from '../../src/storage/in-memory-store';
import { Ticket } from '../../src/domain/ticket';

// Kho trong BO NHO, khong cham dia -> mo test nay van la UNIT test.
// Theo truc "co ra ngoai chuong trinh khong": goi ham cua chinh minh thi khong tinh.
function setup(seed: Ticket[] = []) {
  const out: string[] = [];
  const deps = {
    store: new InMemoryTicketStore(seed),
    now: () => new Date('2026-09-01T10:00:00.000Z'),
    generateId: () => 'T-1',
    log: (msg: string) => out.push(msg),
  };
  return { deps, out };
}

const seedTicket: Ticket = {
  id: 'T-9',
  title: 'Ticket có sẵn',
  description: '',
  status: 'open',
  priority: 'low',
  tags: ['bug'],
  createdAt: '2026-09-01T09:00:00.000Z',
};

describe('tickets create', () => {
  it('tạo được thì trả exit code 0', () => {
    const { deps } = setup();
    expect(run(['create', '--title', 'Sửa lỗi đăng nhập'], deps)).toBe(0);
  });

  it('tạo xong thì ticket nằm trong kho', () => {
    const { deps } = setup();
    run(['create', '--title', 'Sửa lỗi đăng nhập'], deps);
    expect(deps.store.load()).toHaveLength(1);
    expect(deps.store.load()[0].title).toBe('Sửa lỗi đăng nhập');
  });

  it('title rỗng thì exit code khác 0 và KHÔNG lưu gì', () => {
    const { deps } = setup();
    expect(run(['create', '--title', ''], deps)).not.toBe(0);
    expect(deps.store.load()).toHaveLength(0);
  });

  it('priority ngoài tập cho phép thì bị từ chối ngay ở biên CLI', () => {
    const { deps } = setup();
    expect(run(['create', '--title', 'A', '--priority', 'khan-cap'], deps)).not.toBe(0);
    expect(deps.store.load()).toHaveLength(0);
  });
});

describe('tickets list', () => {
  it('kho rỗng thì báo thân thiện và vẫn exit code 0', () => {
    const { deps, out } = setup();
    expect(run(['list'], deps)).toBe(0);
    expect(out.join('\n')).toContain('Chưa có ticket nào');
  });

  it('lọc theo status', () => {
    const { deps, out } = setup([seedTicket, { ...seedTicket, id: 'T-8', status: 'done' }]);
    run(['list', '--status', 'done'], deps);
    expect(out.join('\n')).toContain('T-8');
    expect(out.join('\n')).not.toContain('T-9');
  });

  it('lọc không khớp gì thì vẫn exit code 0, không phải lỗi', () => {
    const { deps } = setup([seedTicket]);
    expect(run(['list', '--status', 'done'], deps)).toBe(0);
  });
});

describe('tickets show', () => {
  it('id tồn tại thì in ra đủ các field', () => {
    const { deps, out } = setup([seedTicket]);
    expect(run(['show', 'T-9'], deps)).toBe(0);
    const printed = out.join('\n');
    expect(printed).toContain('Ticket có sẵn');
    expect(printed).toContain('bug');
  });

  it('id không tồn tại thì exit code khác 0', () => {
    const { deps } = setup([seedTicket]);
    expect(run(['show', 'T-999'], deps)).not.toBe(0);
  });

  it('không truyền id thì là lỗi validate, KHÁC lỗi không tìm thấy', () => {
    const { deps, out } = setup([seedTicket]);
    run(['show'], deps);
    expect(out.join('\n')).toContain('thiếu');
    expect(out.join('\n')).not.toContain('không tìm thấy');
  });
});

describe('tickets update', () => {
  it('đổi status thì lưu lại vào kho', () => {
    const { deps } = setup([seedTicket]);
    expect(run(['update', 'T-9', '--status', 'done'], deps)).toBe(0);
    expect(deps.store.load()[0].status).toBe('done');
  });

  it('id không tồn tại thì exit code khác 0', () => {
    const { deps } = setup([seedTicket]);
    expect(run(['update', 'T-999', '--status', 'done'], deps)).not.toBe(0);
  });

  it('không truyền field nào thì báo lỗi validate', () => {
    const { deps } = setup([seedTicket]);
    expect(run(['update', 'T-9'], deps)).not.toBe(0);
  });
});

describe('lệnh không tồn tại', () => {
  it('trả exit code khác 0 và in hướng dẫn', () => {
    const { deps, out } = setup();
    expect(run(['xoa-het'], deps)).not.toBe(0);
    expect(out.join('\n')).toContain('Cách dùng');
  });
});
