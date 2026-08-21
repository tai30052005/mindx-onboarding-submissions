const { randomUUID } = require('node:crypto');

// Ham KHONG duoc tiem gi ca - dung crypto va Date truc tiep
function createTicket(title) {
  return { id: randomUUID(), title, status: 'open', createdAt: new Date().toISOString() };
}

describe('test-last co bi ep dung toBeDefined() khong', () => {
  beforeEach(() => { jest.useFakeTimers(); jest.setSystemTime(new Date('2026-08-20T10:00:00.000Z')); });
  afterEach(() => { jest.useRealTimers(); });

  test('createdAt: assert GIA TRI CHINH XAC du khong tiem clock', () => {
    const t = createTicket('Fix login bug');
    expect(t.createdAt).toBe('2026-08-20T10:00:00.000Z');
  });

  test('id: assert DINH DANG, khong can toBeDefined()', () => {
    const t = createTicket('Fix login bug');
    expect(t.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  test('id: hai lan goi ra hai gia tri khac nhau', () => {
    expect(createTicket('A').id).not.toBe(createTicket('B').id);
  });
});
