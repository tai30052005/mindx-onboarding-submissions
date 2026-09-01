// Do xem unit test va integration test chenh nhau bao nhieu.
//
// Chay:  node --test bench.test.js
// Cuoi output se in ra mot bang tom tat, doc bang do la du.

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

const doUnit = [];
const doIntegration = [];

// --- UNIT: khong ra ngoai chuong trinh, chay thuan trong bo nho ---
for (let i = 1; i <= 5; i++) {
  test(`UNIT ${i} - validate trong bo nho`, () => {
    const t0 = performance.now();
    assert.strictEqual(createTicket('Fix bug').status, 'open');
    assert.throws(() => createTicket('   '));
    doUnit.push(performance.now() - t0);
  });
}

// --- INTEGRATION: ghi/doc file that -> co ra ngoai chuong trinh ---
// Moi test mot thu muc tam rieng, khong thi chay song song se de len nhau.
for (let i = 1; i <= 5; i++) {
  test(`INTEGRATION ${i} - ghi roi doc lai file JSON that`, () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tk-'));
    try {
      const t0 = performance.now();
      save(dir, [createTicket('Fix bug')]);
      assert.strictEqual(load(dir)[0].status, 'open');
      doIntegration.push(performance.now() - t0);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
}

// In bang tom tat sau khi chay xong.
// Bo lan do dau tien moi nhom: lan dau Node con dang khoi dong nen luon cham bat thuong.
process.on('exit', () => {
  const trungBinh = (a) => a.slice(1).reduce((x, y) => x + y, 0) / (a.length - 1);
  const u = trungBinh(doUnit);
  const i = trungBinh(doIntegration);

  console.log('');
  console.log('==================== KET QUA DO ====================');
  console.log(`  UNIT         (khong ra ngoai) : ${u.toFixed(3)} ms / test`);
  console.log(`  INTEGRATION  (ghi doc file)   : ${i.toFixed(3)} ms / test`);
  console.log(`  Integration cham hon unit     : ${(i / u).toFixed(0)} lan`);
  console.log('');
  console.log(`  500 integration test se mat   : ${(i * 500 / 1000).toFixed(2)} giay`);
  console.log('  -> Van duoi 1 giay, nen ly do "integration cham qua" khong dung.');
  console.log('====================================================');
});
