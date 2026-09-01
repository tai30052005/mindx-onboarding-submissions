import { readFileSync, writeFileSync } from 'node:fs';
import { CorruptedStoreError } from '../errors';
import { Ticket } from '../domain/ticket';
import { TicketStore } from './ticket-store';

/**
 * Tang luu tru: doc/ghi file JSON that tren dia.
 * Day la cho DUY NHAT trong app cham vao he thong file, nen no la cho duy nhat
 * can integration test. Moi thu khac chay thuan trong bo nho.
 */
export class JsonTicketStore implements TicketStore {
  constructor(private readonly filePath: string) {}

  load(): Ticket[] {
    let raw: string;

    try {
      raw = readFileSync(this.filePath, 'utf8');
    } catch (err) {
      // File chua ton tai la chuyen BINH THUONG lan chay dau -> coi nhu kho rong.
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
      throw err;
    }

    try {
      return JSON.parse(raw) as Ticket[];
    } catch {
      // File hong thi bao loi roi DUNG. Khong ghi de len no,
      // vi ghi de la lam mat du lieu cua nguoi dung.
      throw new CorruptedStoreError(
        `file dữ liệu hỏng, không đọc được: ${this.filePath}`
      );
    }
  }

  save(tickets: Ticket[]): void {
    writeFileSync(this.filePath, JSON.stringify(tickets, null, 2), 'utf8');
  }
}
