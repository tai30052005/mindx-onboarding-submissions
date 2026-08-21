// File test cho Ticket Manager CLI.
// Nhiệm vụ: đọc và tìm ra những chỗ có vấn đề. Có ít nhất 4 lỗi.
// Đừng chạy, đừng hỏi AI. Đọc và tự soi trước.

import { createTicket, updateTicket } from '../src/domain/ticket';
import { JsonTicketStore } from '../src/storage/json-store';
import { writeFileSync } from 'node:fs';

const STORE_PATH = './tickets.json';

describe('Ticket', () => {
  it('tạo được ticket', () => {
    const t = createTicket({ title: 'Fix login bug' });
    expect(t).toBeDefined();
    expect(t.id).toBeTruthy();
  });

  it('title được lưu đúng', () => {
    const t = createTicket({ title: 'Fix login bug' });
    expect(t.title).toBe('Fix login bug');
  });

  it('serialize ra đúng định dạng', () => {
    const t = createTicket({ title: 'A' });
    expect(JSON.stringify(t)).toBe('{"id":"T-1","title":"A","status":"open"}');
  });

  it('từ chối title rỗng', () => {
    expect(() => createTicket({ title: '' })).toThrow('rỗng');
  });

  it('báo lỗi khi file JSON hỏng', () => {
    writeFileSync(STORE_PATH, '{ hong');
    const store = new JsonTicketStore(STORE_PATH);
    expect(() => store.load()).toThrow();
  });

  it('update giữ nguyên các field khác', async () => {
    const t = createTicket({ title: 'A' });
    const updated = await updateTicket(t.id, { status: 'done' });
    expect(updated.status).toBe('done');
  });
});
