// Test file cho lệnh `tickets update <id>`, viết theo mục cùng tên trong
// 03-cli-test-plan.md. Chưa chạy được: import từ src/ của tuần 2 chưa tồn tại.
//
// Ba quyết định thiết kế mà file này dựa vào (03-cli-test-plan.md):
//   1. store được tiêm vào, không dựng bên trong hàm
//   2. hàm xử lý lệnh *trả về* exit code, không gọi process.exit()
//   3. mỗi integration test một thư mục tạm riêng

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  updateTicket,
  NotFoundError,
  ValidationError,
  type Ticket,
  type TicketStore,
} from '../src/domain/ticket';
import { CorruptedStoreError, JsonTicketStore } from '../src/storage/json-store';
import { runUpdate } from '../src/commands/update';

// --- helpers ---------------------------------------------------------------

function makeTicket(over: Partial<Ticket> = {}): Ticket {
  return {
    id: 'T-1',
    title: 'Fix login bug',
    description: 'Đăng nhập bằng Google trả 500',
    status: 'open',
    priority: 'medium',
    tags: ['auth'],
    createdAt: new Date('2026-08-20T10:00:00.000Z'),
    ...over,
  };
}

/** Bản in-memory của cùng interface JsonTicketStore hiện thực. Đếm luôn số
 *  lần save để khẳng định được "bị từ chối thì không ghi gì". */
class InMemoryTicketStore implements TicketStore {
  saveCount = 0;

  constructor(private tickets: Ticket[] = []) {}

  async load(): Promise<Ticket[]> {
    return this.tickets.map((t) => ({ ...t }));
  }

  async save(tickets: Ticket[]): Promise<void> {
    this.saveCount += 1;
    this.tickets = tickets.map((t) => ({ ...t }));
  }
}

// --- Unit: updateTicket ----------------------------------------------------

describe('updateTicket', () => {
  it('đổi status sang giá trị hợp lệ', async () => {
    const store = new InMemoryTicketStore([makeTicket({ status: 'open' })]);

    const updated = await updateTicket('T-1', { status: 'done' }, store);

    expect(updated.status).toBe('done');
    expect((await store.load())[0].status).toBe('done');
  });

  it('từ chối status ngoài tập cho phép bằng ValidationError', async () => {
    const store = new InMemoryTicketStore([makeTicket({ status: 'open' })]);

    await expect(
      updateTicket('T-1', { status: 'finished' as never }, store),
    ).rejects.toThrow(ValidationError);

    // Bị từ chối thì kho không được đụng tới — cả nội dung lẫn số lần ghi.
    expect((await store.load())[0].status).toBe('open');
    expect(store.saveCount).toBe(0);
  });

  it('từ chối priority ngoài tập cho phép bằng ValidationError', async () => {
    const store = new InMemoryTicketStore([makeTicket({ priority: 'medium' })]);

    await expect(
      updateTicket('T-1', { priority: 'urgent' as never }, store),
    ).rejects.toThrow(ValidationError);

    expect(store.saveCount).toBe(0);
  });

  it('báo NotFoundError khi id không tồn tại', async () => {
    const store = new InMemoryTicketStore([makeTicket({ id: 'T-1' })]);

    await expect(
      updateTicket('T-404', { status: 'done' }, store),
    ).rejects.toThrow(NotFoundError);
  });

  it('lỗi not found không phải là lỗi validate', async () => {
    const store = new InMemoryTicketStore([makeTicket({ id: 'T-1' })]);

    // Hai loại lỗi phải tách rời, nếu không lớp CLI không map ra hai exit code
    // và hai thông báo khác nhau được.
    await expect(
      updateTicket('T-404', { status: 'done' }, store),
    ).rejects.not.toThrow(ValidationError);
  });

  it('chỉ đổi field được truyền, các field khác giữ nguyên', async () => {
    const before = makeTicket();
    const store = new InMemoryTicketStore([before]);

    const updated = await updateTicket('T-1', { status: 'done' }, store);

    // toEqual trên cả object, không phải assert từng field — tên test hứa
    // "các field khác giữ nguyên" thì phải kiểm đúng chừng đó.
    expect(updated).toEqual({ ...before, status: 'done' });
  });

  it('không sửa tại chỗ object trong kho', async () => {
    const before = makeTicket({ status: 'open' });
    const store = new InMemoryTicketStore([before]);

    await updateTicket('T-1', { status: 'done' }, store);

    expect(before.status).toBe('open');
  });

  it('từ chối title rỗng — cùng luật validate với create', async () => {
    const store = new InMemoryTicketStore([makeTicket()]);

    await expect(updateTicket('T-1', { title: '' }, store)).rejects.toThrow(
      ValidationError,
    );
  });

  it('từ chối title toàn khoảng trắng', async () => {
    const store = new InMemoryTicketStore([makeTicket()]);

    await expect(updateTicket('T-1', { title: '   ' }, store)).rejects.toThrow(
      ValidationError,
    );
  });

  it('khử trùng lặp trong tags mới', async () => {
    const store = new InMemoryTicketStore([makeTicket({ tags: ['auth'] })]);

    const updated = await updateTicket(
      'T-1',
      { tags: ['bug', 'bug', 'auth'] },
      store,
    );

    expect(updated.tags).toEqual(['bug', 'auth']);
  });

  it('tags mới thay thế tags cũ chứ không nối thêm', async () => {
    const store = new InMemoryTicketStore([makeTicket({ tags: ['auth'] })]);

    const updated = await updateTicket('T-1', { tags: ['ui'] }, store);

    expect(updated.tags).toEqual(['ui']);
  });

  // Đề bài không nói update rỗng nên bị từ chối hay là no-op. Đây là quyết định
  // về đặc tả, chốt xong mới viết được assertion — xem mục "Still unsure about"
  // trong 03-cli-test-plan.md.
  it.todo('update không truyền field nào: từ chối hay no-op?');
});

// --- Unit: biên CLI --------------------------------------------------------

describe('runUpdate (biên CLI)', () => {
  let out: string[];
  let err: string[];

  const io = () => ({
    out: (line: string) => out.push(line),
    err: (line: string) => err.push(line),
  });

  beforeEach(() => {
    out = [];
    err = [];
  });

  it('trả exit code 0 khi update thành công', async () => {
    const store = new InMemoryTicketStore([makeTicket()]);

    const code = await runUpdate(['T-1', '--status', 'done'], {
      store,
      ...io(),
    });

    expect(code).toBe(0);
  });

  it('status sai: exit code khác 0 và thông báo nói rõ field nào sai', async () => {
    const store = new InMemoryTicketStore([makeTicket()]);

    const code = await runUpdate(['T-1', '--status', 'finished'], {
      store,
      ...io(),
    });

    expect(code).not.toBe(0);
    expect(err.join('\n')).toMatch(/status/);
    expect(store.saveCount).toBe(0);
  });

  it('id không tồn tại: exit code khác 0 và nhắc lại id đã nhập', async () => {
    const store = new InMemoryTicketStore([makeTicket({ id: 'T-1' })]);

    const code = await runUpdate(['T-404', '--status', 'done'], {
      store,
      ...io(),
    });

    expect(code).not.toBe(0);
    expect(err.join('\n')).toMatch(/T-404/);
  });

  it('exit code của not found khác exit code của invalid input', async () => {
    const store = () => new InMemoryTicketStore([makeTicket({ id: 'T-1' })]);

    const notFound = await runUpdate(['T-404', '--status', 'done'], {
      store: store(),
      ...io(),
    });
    const invalid = await runUpdate(['T-1', '--status', 'finished'], {
      store: store(),
      ...io(),
    });

    expect(notFound).not.toBe(invalid);
  });

  it('thiếu id: lỗi validate, khác lỗi not found', async () => {
    const store = new InMemoryTicketStore([makeTicket()]);

    const code = await runUpdate(['--status', 'done'], { store, ...io() });

    expect(code).not.toBe(0);
    expect(err.join('\n')).not.toMatch(/not found/i);
  });

  it('không in stack trace ra stderr khi lỗi', async () => {
    const store = new InMemoryTicketStore([makeTicket()]);

    await runUpdate(['T-1', '--status', 'finished'], { store, ...io() });

    expect(err.join('\n')).not.toMatch(/\bat .+:\d+:\d+/);
  });
});

// --- Integration: file JSON thật -------------------------------------------

describe('tickets update với file JSON thật', () => {
  let dir: string;
  let file: string;

  const readTickets = (): Ticket[] => JSON.parse(readFileSync(file, 'utf8'));

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'tickets-update-'));
    file = join(dir, 'tickets.json');
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it('lưu thay đổi xuống đĩa, đọc lại thấy đúng', async () => {
    writeFileSync(file, JSON.stringify([makeTicket({ id: 'T-1' })]));
    const store = new JsonTicketStore(file);

    await updateTicket('T-1', { status: 'done' }, store);

    expect(readTickets()[0].status).toBe('done');
  });

  it('update một ticket không đụng tới ticket khác', async () => {
    writeFileSync(
      file,
      JSON.stringify([
        makeTicket({ id: 'T-1', title: 'A', status: 'open' }),
        makeTicket({ id: 'T-2', title: 'B', status: 'open', tags: ['ui'] }),
      ]),
    );
    const store = new JsonTicketStore(file);

    await updateTicket('T-1', { status: 'done' }, store);

    const [first, second] = readTickets();
    expect(first.status).toBe('done');
    expect(second).toEqual(
      expect.objectContaining({ id: 'T-2', title: 'B', status: 'open', tags: ['ui'] }),
    );
  });

  it('giữ nguyên số lượng bản ghi', async () => {
    writeFileSync(
      file,
      JSON.stringify([makeTicket({ id: 'T-1' }), makeTicket({ id: 'T-2' })]),
    );
    const store = new JsonTicketStore(file);

    await updateTicket('T-1', { priority: 'high' }, store);

    expect(readTickets()).toHaveLength(2);
  });

  it('file JSON hỏng: báo CorruptedStoreError và không ghi đè dữ liệu', async () => {
    const corrupted = '{ this is not json';
    writeFileSync(file, corrupted);
    const store = new JsonTicketStore(file);

    await expect(
      updateTicket('T-1', { status: 'done' }, store),
    ).rejects.toThrow(CorruptedStoreError);

    // Quan trọng hơn cả loại lỗi: dữ liệu người dùng còn nguyên.
    expect(readFileSync(file, 'utf8')).toBe(corrupted);
  });

  it('thiếu file tickets.json: báo not found, không tạo file rỗng', async () => {
    const store = new JsonTicketStore(file);

    await expect(
      updateTicket('T-1', { status: 'done' }, store),
    ).rejects.toThrow(NotFoundError);

    expect(() => readFileSync(file, 'utf8')).toThrow();
  });

  it('validate hỏng thì không ghi gì xuống đĩa', async () => {
    const original = JSON.stringify([makeTicket({ id: 'T-1', status: 'open' })]);
    writeFileSync(file, original);
    const store = new JsonTicketStore(file);

    await expect(
      updateTicket('T-1', { status: 'finished' as never }, store),
    ).rejects.toThrow(ValidationError);

    expect(readFileSync(file, 'utf8')).toBe(original);
  });
});
