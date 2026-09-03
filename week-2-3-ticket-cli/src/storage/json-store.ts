import { readFileSync, writeFileSync } from 'node:fs';
import { CorruptedStoreError } from '../errors';
import { Ticket } from '../domain/ticket';
import { TicketStore } from './ticket-store';

/**
 * Tầng lưu trữ: đọc ghi file JSON thật trên đĩa.
 * Đây là chỗ duy nhất trong app chạm vào hệ thống file, nên cũng là chỗ duy nhất
 * cần integration test. Mọi thứ khác chạy thuần trong bộ nhớ.
 */
export class JsonTicketStore implements TicketStore {
  constructor(private readonly filePath: string) {}

  load(): Ticket[] {
    let raw: string;

    try {
      raw = readFileSync(this.filePath, 'utf8');
    } catch (err) {
      // File chưa tồn tại là chuyện bình thường lần chạy đầu, nên coi như kho rỗng.
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
      throw err;
    }

    try {
      return JSON.parse(raw) as Ticket[];
    } catch {
      // File hỏng thì báo lỗi rồi dừng. Không ghi đè lên nó,
      // vì ghi đè là làm mất dữ liệu của người dùng.
      throw new CorruptedStoreError(
        `file dữ liệu hỏng, không đọc được: ${this.filePath}`
      );
    }
  }

  save(tickets: Ticket[]): void {
    writeFileSync(this.filePath, JSON.stringify(tickets, null, 2), 'utf8');
  }
}
