// Cau hoi: test cho ham async ma viet sai thi co bi bat khong,
// hay no xanh gia?
//
// Chay:  node --test async-test.test.js
// Ket qua dung: 2 pass, 1 fail. Cai fail la co y - doc giai thich ben duoi.

const { test } = require('node:test');
const assert = require('node:assert');

// Ham async luon nem loi.
async function load() {
  throw new Error('file hong');
}

test('DUNG CACH - bat loi cua ham async', async () => {
  await assert.rejects(load(), /file hong/);
});

test('XANH GIA - quen await nen khong kiem gi ca', () => {
  // Thieu chu await o dong duoi. assert.rejects tra ve mot promise,
  // nhung khong ai cho no, nen test ket thuc truoc khi biet ket qua.
  assert.rejects(load(), /mot thong bao hoan toan khac/);
  // Test nay XANH, du khang dinh trong do sai hoan toan.
});

test('CO Y DO - de thay khi lam dung thi loi sai bi bat that', async () => {
  await assert.rejects(load(), /mot thong bao hoan toan khac/);
});
