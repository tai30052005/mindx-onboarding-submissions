export type Status = 'open' | 'done';

export interface Ticket {
  title: string;
  status: Status;
}

export function createTicket(title: string): Ticket {
  if (title.trim() === '') throw new Error('title không được rỗng');
  return { title, status: 'open' };
}
