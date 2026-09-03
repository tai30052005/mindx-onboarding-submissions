#!/usr/bin/env node
import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import { run } from './commands/run';
import { JsonTicketStore } from './storage/json-store';

/**
 * Entrypoint. Đây là chỗ duy nhất được gọi process.exit().
 * Mọi hàm khác chỉ trả về exit code, để test gọi được mà không giết tiến trình Jest.
 */
const file = process.env.TICKETS_FILE ?? join(process.cwd(), 'tickets.json');

const code = run(process.argv.slice(2), {
  store: new JsonTicketStore(file),
  now: () => new Date(),
  generateId: () => randomUUID().slice(0, 8),
  log: (message) => console.log(message),
});

process.exit(code);
