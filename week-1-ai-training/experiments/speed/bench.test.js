const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

function createTicket(title) {
  if (title.trim() === '') throw new Error('title rong');
  return { title, status: 'open' };
}
function save(dir, tickets) {
  fs.writeFileSync(path.join(dir, 'tickets.json'), JSON.stringify(tickets));
}
function load(dir) {
  return JSON.parse(fs.readFileSync(path.join(dir, 'tickets.json'), 'utf8'));
}

// --- UNIT: thuan bo nho ---
for (let i = 1; i <= 5; i++) {
  test(`UNIT ${i} - validate trong bo nho`, () => {
    assert.strictEqual(createTicket('Fix bug').status, 'open');
    assert.throws(() => createTicket('   '));
  });
}

// --- INTEGRATION: ghi/doc file that trong thu muc tam ---
for (let i = 1; i <= 5; i++) {
  test(`INTEGRATION ${i} - round-trip file JSON`, () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tk-'));
    try {
      save(dir, [createTicket('Fix bug')]);
      assert.strictEqual(load(dir)[0].status, 'open');
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
}
