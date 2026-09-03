import { Ticket } from '../domain/ticket';

/**
 * Tầng lệnh chỉ biết đến interface này, không biết dữ liệu nằm ở đâu.
 * Nhờ vậy test tầng lệnh chạy được với kho trong bộ nhớ, không phải tạo file thật.
 * Tuần 3 cắm HTTP client vào thì chỉ cần thêm một bản mới cũng có load() và save().
 */
export interface TicketStore {
  load(): Ticket[];
  save(tickets: Ticket[]): void;
}
