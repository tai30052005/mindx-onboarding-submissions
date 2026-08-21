// Ban sua lai sau khi review. Sua 3 cho: STORE_PATH, Test 1, Test 4.
// Cac test con lai giu nguyen, danh dau TODO — xem 05-common-mistakes.md.

import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { createTicket, updateTicket, ValidationError } from '../src/domain/ticket';
import { JsonTicketStore } from '../src/storage/json-store';

const deps = {
  now: () => new Date('2026-08-20T10:00:00.000Z'),
  generateId: () => 'T-1',
};

describe('createTicket', () => {
  it('gán status mặc định là open', () => {
    const t = createTicket({ title: 'Fix login bug' }, deps);
    expect(t.status).toBe('open');
  });

  it('sinh id từ generateId được tiêm', () => {
    const t = createTicket({ title: 'Fix login bug' }, deps);
    expect(t.id).toBe('T-1');
  });

  it('từ chối title rỗng bằng ValidationError', () => {
    expect(() => createTicket({ title: '' }, deps)).toThrow(ValidationError);
  });

  // TODO chua sua: dang test phep gan cua JavaScript, khong test logic nao
  it('title được lưu đúng', () => {
    const t = createTicket({ title: 'Fix login bug' }, deps);
    expect(t.title).toBe('Fix login bug');
  });

  // TODO chua sua: buoc test vao thu tu khoa khi serialize
  it('serialize ra đúng định dạng', () => {
    const t = createTicket({ title: 'A' }, deps);
    expect(JSON.stringify(t)).toBe('{"id":"T-1","title":"A","status":"open"}');
  });
});

describe('JsonTicketStore', () => {
  let dir: string;

  beforeEach(() => { dir = mkdtempSync(join(tmpdir(), 'tickets-')); });
  afterEach(() => { rmSync(dir, { recursive: true, force: true }); });

  // TODO chua sua het: da co thu muc tam rieng va da await,
  // nhung van con toThrow() khong tham so — chua phan biet duoc loai loi
  it('báo lỗi khi file JSON hỏng', async () => {
    const file = join(dir, 'tickets.json');
    writeFileSync(file, '{ hong');
    const store = new JsonTicketStore(file);
    await expect(store.load()).rejects.toThrow();
  });
});

describe('updateTicket', () => {
  // TODO chua sua: ten test hua kiem "giu nguyen field khac"
  // nhung chi assert status
  it('update giữ nguyên các field khác', async () => {
    const t = createTicket({ title: 'A' }, deps);
    const updated = await updateTicket(t.id, { status: 'done' });
    expect(updated.status).toBe('done');
  });
});
