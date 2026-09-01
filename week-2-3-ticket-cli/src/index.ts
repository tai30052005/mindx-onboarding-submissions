#!/usr/bin/env node
import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import { run } from './commands/run';
import { JsonTicketStore } from './storage/json-store';

/**
 * Entrypoint. Day la cho DUY NHAT duoc goi process.exit().
 * Moi ham khac chi TRA VE exit code, de test goi duoc ma khong giet tien trinh Jest.
 */
const file = process.env.TICKETS_FILE ?? join(process.cwd(), 'tickets.json');

const code = run(process.argv.slice(2), {
  store: new JsonTicketStore(file),
  now: () => new Date(),
  generateId: () => randomUUID().slice(0, 8),
  log: (message) => console.log(message),
});

process.exit(code);
