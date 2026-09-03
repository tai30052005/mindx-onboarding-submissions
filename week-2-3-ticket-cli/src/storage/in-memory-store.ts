import { Ticket } from '../domain/ticket';
import { TicketStore } from './ticket-store';

/** Bản giả dùng trong test. Giữ dữ liệu trong bộ nhớ, mất khi chương trình tắt. */
export class InMemoryTicketStore implements TicketStore {
  constructor(private tickets: Ticket[] = []) {}

  load(): Ticket[] {
    return [...this.tickets];
  }

  save(tickets: Ticket[]): void {
    this.tickets = [...tickets];
  }
}
