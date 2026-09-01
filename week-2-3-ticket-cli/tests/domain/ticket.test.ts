import { createTicket } from '../../src/domain/ticket';
import { ValidationError } from '../../src/errors';

const deps = {
  now: () => new Date('2026-09-01T10:00:00.000Z'),
  generateId: () => 'T-1',
};

describe('createTicket', () => {
  it('ticket mới có status là open', () => {
    const t = createTicket({ title: 'Sửa lỗi đăng nhập' }, deps);
    expect(t.status).toBe('open');
  });
});

describe('createTicket - luat validate title', () => {
  it('title rỗng thì ném ValidationError', () => {
    expect(() => createTicket({ title: '' }, deps)).toThrow(ValidationError);
  });

  it('title toàn khoảng trắng cũng ném ValidationError', () => {
    expect(() => createTicket({ title: '   ' }, deps)).toThrow(ValidationError);
  });
});
