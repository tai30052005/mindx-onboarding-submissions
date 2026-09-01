import { TicketStore } from '../storage/ticket-store';

export type RunDeps = {
  store: TicketStore;
  now: () => Date;
  generateId: () => string;
  log: (message: string) => void;
};
