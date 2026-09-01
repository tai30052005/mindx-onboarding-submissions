const test = require('node:test');
const assert = require('node:assert');
const { createTicket } = require('./ticket');

// Test 1 - ticket moi phai co status la "open"
test('tạo ticket mới thì status là open', () => {
  const t = createTicket('Fix login bug');
  assert.strictEqual(t.status, 'open');
});

// Test 2 - title rong thi phai nem loi
test('title rỗng thì ném lỗi', () => {
  assert.throws(() => createTicket(''), /title không được rỗng/);
});

// Test 3 - title toan khoang trang cung phai bi coi la rong
// Day la test buoc code phai dung title.trim() chu khong phai title === ''
test('title toàn khoảng trắng cũng bị coi là rỗng', () => {
  assert.throws(() => createTicket('   '), /title không được rỗng/);
});
