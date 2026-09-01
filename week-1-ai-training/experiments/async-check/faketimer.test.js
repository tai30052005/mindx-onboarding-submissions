// Cau hoi: neu ham tu goi new Date() ben trong, thi test co bi ep dung
// toBeDefined() (assertion yeu) khong?
//
// Chay:  node --test faketimer.test.js

const { test, mock } = require('node:test');
const assert = require('node:assert');
const { randomUUID } = require('node:crypto');

// Ham nay KHONG duoc tiem gi ca - no tu goi Date va randomUUID ben trong.
function createTicket(title) {
  return {
    id: randomUUID(),
    title,
    status: 'open',
    createdAt: new Date().toISOString(),
  };
}

test('khoa dong ho lai thi assert duoc GIA TRI CHINH XAC', () => {
  mock.timers.enable({ apis: ['Date'], now: new Date('2026-08-20T10:00:00.000Z') });

  const t = createTicket('Fix login bug');
  assert.strictEqual(t.createdAt, '2026-08-20T10:00:00.000Z');

  mock.timers.reset();
});

test('id: assert theo DINH DANG, khong can toBeDefined()', () => {
  const t = createTicket('Fix login bug');
  assert.match(t.id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
});
