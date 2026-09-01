import { Ticket } from '../domain/ticket';

/**
 * Tang lenh chi biet den interface nay, khong biet du lieu nam o dau.
 * Nho vay test tang lenh chay duoc voi kho trong bo nho (nhanh, khong cham dia),
 * con luc chay that thi cam JsonTicketStore vao.
 * Tuan 3 cam them HTTP client cung se di qua cho nay.
 */
export interface TicketStore {
  load(): Ticket[];
  save(tickets: Ticket[]): void;
}
