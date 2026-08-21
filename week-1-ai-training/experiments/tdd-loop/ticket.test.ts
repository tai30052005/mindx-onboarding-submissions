import test from 'node:test';
import assert from 'node:assert';
import { createTicket } from './ticket.ts';

test('tạo ticket mới với status "open"', () => {
  const t = createTicket('Fix login bug');
  assert.strictEqual(t.status, 'open');
});

test('ném lỗi khi title rỗng', () => {
  assert.throws(() => createTicket(''), /title không được rỗng/);
});

test('coi title chỉ có khoảng trắng là rỗng', () => {
  assert.throws(() => createTicket('   '), /title không được rỗng/);
});
