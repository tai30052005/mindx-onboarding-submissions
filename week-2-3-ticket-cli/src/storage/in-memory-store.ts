import { Ticket } from '../domain/ticket';
import { TicketStore } from './ticket-store';

/** Ban gia dung trong test. Giu du lieu trong bo nho, mat khi chuong trinh tat. */
export class InMemoryTicketStore implements TicketStore {
  constructor(private tickets: Ticket[] = []) {}

  load(): Ticket[] {
    return [...this.tickets];
  }

  save(tickets: Ticket[]): void {
    this.tickets = [...tickets];
  }
}
