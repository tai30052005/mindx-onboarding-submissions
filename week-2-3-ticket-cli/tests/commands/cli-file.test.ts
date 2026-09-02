import { mkdtempSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { run } from '../../src/commands/run';
import { JsonTicketStore } from '../../src/storage/json-store';

// INTEGRATION test: cac test nay di qua bien that la he thong file.
// Moi test mot thu muc tam rieng, khong test nao ghi de len test nao.
describe('CLI chạy với file JSON thật', () => {
  let dir: string;
  let file: string;

  const setup = () => {
    const out: string[] = [];
    return {
      out,
      deps: {
        store: new JsonTicketStore(file),
        now: () => new Date('2026-09-01T10:00:00.000Z'),
        generateId: () => 'T-1',
        log: (m: string) => out.push(m),
      },
    };
  };

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'cli-'));
    file = join(dir, 'tickets.json');
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it('create khi file chưa tồn tại thì tự tạo file, không văng lỗi', () => {
    const { deps } = setup();
    expect(run(['create', '--title', 'Sửa lỗi đăng nhập'], deps)).toBe(0);
    const luu = JSON.parse(readFileSync(file, 'utf8'));
    expect(luu).toHaveLength(1);
    expect(luu[0].title).toBe('Sửa lỗi đăng nhập');
  });

  it('create rồi list thì thấy ticket vừa tạo', () => {
    const a = setup();
    run(['create', '--title', 'Sửa lỗi đăng nhập'], a.deps);
    const b = setup();
    run(['list'], b.deps);
    expect(b.out.join('\n')).toContain('Sửa lỗi đăng nhập');
  });

  it('show với id không tồn tại thì exit code khác 0', () => {
    const { deps } = setup();
    run(['create', '--title', 'A'], deps);
    expect(run(['show', 'T-999'], deps)).not.toBe(0);
  });

  it('update rồi đọc lại file thì thấy thay đổi đã lưu xuống đĩa', () => {
    const { deps } = setup();
    run(['create', '--title', 'A'], deps);
    run(['update', 'T-1', '--status', 'done'], deps);
    const luu = JSON.parse(readFileSync(file, 'utf8'));
    expect(luu[0].status).toBe('done');
  });

  it('file tickets.json hỏng thì báo lỗi rõ và KHÔNG ghi đè', () => {
    const noiDungHong = '{ đây không phải json';
    writeFileSync(file, noiDungHong);
    const { deps, out } = setup();

    const code = run(['list'], deps);

    expect(code).not.toBe(0);
    expect(out.join('\n')).toContain('file dữ liệu hỏng');
    expect(readFileSync(file, 'utf8')).toBe(noiDungHong);
  });

  it('kho rỗng thì list vẫn exit code 0', () => {
    const { deps } = setup();
    expect(run(['list'], deps)).toBe(0);
  });
});

// Ba ca duoi day vá đúng ba chỗ `03-cli-test-plan.md` có liệt kê mà code chưa phủ.
// Chúng là test viết sau, không phải test-first: hành vi đã chạy đúng sẵn rồi.
describe('ba ca integration còn thiếu so với 03-cli-test-plan.md', () => {
  let dir: string;
  let file: string;

  const setup = (id = 'T-1') => {
    const out: string[] = [];
    return {
      out,
      deps: {
        store: new JsonTicketStore(file),
        now: () => new Date('2026-09-01T10:00:00.000Z'),
        generateId: () => id,
        log: (m: string) => out.push(m),
      },
    };
  };

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'cli-gap-'));
    file = join(dir, 'tickets.json');
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it('list đọc từ file thật rồi lọc theo status', () => {
    run(['create', '--title', 'Còn mở'], setup('T-1').deps);
    run(['create', '--title', 'Đã xong'], setup('T-2').deps);
    run(['update', 'T-2', '--status', 'done'], setup().deps);

    const b = setup();
    expect(run(['list', '--status', 'done'], b.deps)).toBe(0);

    const inRa = b.out.join('\n');
    expect(inRa).toContain('Đã xong');
    expect(inRa).not.toContain('Còn mở');
  });

  it('show với id TỒN TẠI, đọc từ file thật', () => {
    run(['create', '--title', 'Sửa lỗi đăng nhập', '--tag', 'bug'], setup('T-1').deps);

    const b = setup();
    expect(run(['show', 'T-1'], b.deps)).toBe(0);
    expect(b.out.join('\n')).toContain('Sửa lỗi đăng nhập');
    expect(b.out.join('\n')).toContain('bug');
  });

  it('update ticket này không làm hỏng ticket kia, trên file thật', () => {
    run(['create', '--title', 'Ticket một'], setup('T-1').deps);
    run(['create', '--title', 'Ticket hai', '--tag', 'ui'], setup('T-2').deps);

    run(['update', 'T-1', '--status', 'done'], setup().deps);

    const luu = JSON.parse(readFileSync(file, 'utf8'));
    const hai = luu.find((t: { id: string }) => t.id === 'T-2');
    expect(hai.title).toBe('Ticket hai');
    expect(hai.status).toBe('open');
    expect(hai.tags).toEqual(['ui']);
  });
});
