// Kiem chung claim cua AI: "voi ham async, expect(() => f()).toThrow() im lang pass".
// Chay tung file rieng vi hai bien the sai lam chet worker.
// Ket qua that (Jest 30 / Node 24): claim do SAI - xem ai-workflow-log.md Part 3 dong 4.

async function load() { throw new Error('file hong'); }

// A va B lam chet worker vi promise bi reject khong ai bat.
// Bo comment tung cai mot de tu kiem chung.

// test('A: expect(() => asyncFn()).toThrow()', () => {
//   expect(() => load()).toThrow();
// });

// test('B: rejects.toThrow() nhung QUEN await', () => {
//   expect(load()).rejects.toThrow('mot thong bao hoan toan khac');
// });

test('C: await expect(...).rejects.toThrow() - dung cach, pass', async () => {
  await expect(load()).rejects.toThrow('file hong');
});

test('D: await + khang dinh SAI - do dung cach, co diff doc duoc', async () => {
  await expect(load()).rejects.toThrow('thong bao hoan toan khac');
});
