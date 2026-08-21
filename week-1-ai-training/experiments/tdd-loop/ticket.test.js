const test = require('node:test');
const assert = require('node:assert');
const { createTicket } = require('./ticket');

// ===== VÒNG 1 =====
test('tạo ticket mới với status "open"', () => {
  const t = createTicket('Fix login bug');
  assert.strictEqual(t.status, 'open');
});

// ===== VÒNG 2 — bỏ dấu // ở 3 dòng dưới khi tới bước C =====
test('ném lỗi khi title rỗng', () => {
  assert.throws(() => createTicket(''), /title không được rỗng/);
});

// ===== VÒNG 3 — bỏ dấu // ở 3 dòng dưới khi tới bước E =====
test('coi title chỉ có khoảng trắng là rỗng', () => {
  assert.throws(() => createTicket('   '), /title không được rỗng/);
});
