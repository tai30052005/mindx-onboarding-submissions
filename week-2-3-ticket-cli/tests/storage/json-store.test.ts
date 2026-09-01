import { mkdtempSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { JsonTicketStore } from '../../src/storage/json-store';
import { CorruptedStoreError } from '../../src/errors';
import { Ticket } from '../../src/domain/ticket';

const sample: Ticket = {
  id: 'T-1',
  title: 'Sửa lỗi đăng nhập',
  description: '',
  status: 'open',
  priority: 'high',
  tags: ['bug'],
  createdAt: '2026-09-01T10:00:00.000Z',
};

describe('JsonTicketStore', () => {
  // Moi test mot thu muc tam RIENG. Dung chung mot file thi cac test ghi de len nhau,
  // test do ma code khong sai gi - luc xanh luc do tuy test nao chay truoc.
  let dir: string;
  let file: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'tickets-'));
    file = join(dir, 'tickets.json');
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it('ghi xuống rồi đọc lại ra đúng ticket', () => {
    const store = new JsonTicketStore(file);
    store.save([sample]);
    const loaded = store.load();
    expect(loaded).toHaveLength(1);
    expect(loaded[0]).toEqual(sample);
  });

  it('file chưa tồn tại thì coi như kho rỗng, không văng lỗi', () => {
    const store = new JsonTicketStore(file);
    expect(store.load()).toEqual([]);
  });

  it('lưu khi file chưa tồn tại thì tự tạo file mới', () => {
    const store = new JsonTicketStore(file);
    store.save([sample]);
    expect(existsSync(file)).toBe(true);
  });

  it('file JSON hỏng thì ném CorruptedStoreError', () => {
    writeFileSync(file, '{ đây không phải json');
    const store = new JsonTicketStore(file);
    expect(() => store.load()).toThrow(CorruptedStoreError);
  });

  it('gặp file hỏng thì KHÔNG ghi đè lên, dữ liệu người dùng còn nguyên', () => {
    const noiDungHong = '{ đây không phải json';
    writeFileSync(file, noiDungHong);
    const store = new JsonTicketStore(file);
    try {
      store.load();
    } catch {
      // dung, phai nem loi
    }
    expect(require('node:fs').readFileSync(file, 'utf8')).toBe(noiDungHong);
  });
});
