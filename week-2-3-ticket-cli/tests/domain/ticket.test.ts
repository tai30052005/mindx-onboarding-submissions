import { createTicket, updateTicket, Ticket } from '../../src/domain/ticket';
import { ValidationError, NotFoundError } from '../../src/errors';

const deps = {
  now: () => new Date('2026-09-01T10:00:00.000Z'),
  generateId: () => 'T-1',
};

describe('createTicket', () => {
  it('ticket mới có status là open', () => {
    const t = createTicket({ title: 'Sửa lỗi đăng nhập' }, deps);
    expect(t.status).toBe('open');
  });

  it('không truyền priority thì nhận giá trị mặc định medium', () => {
    const t = createTicket({ title: 'Sửa lỗi đăng nhập' }, deps);
    expect(t.priority).toBe('medium');
  });

  it('id lấy từ generateId được tiêm vào', () => {
    const t = createTicket({ title: 'Sửa lỗi đăng nhập' }, deps);
    expect(t.id).toBe('T-1');
  });

  it('createdAt lấy từ now được tiêm vào', () => {
    const t = createTicket({ title: 'Sửa lỗi đăng nhập' }, deps);
    expect(t.createdAt).toBe('2026-09-01T10:00:00.000Z');
  });

  it('tags trùng nhau thì khử còn một', () => {
    const t = createTicket({ title: 'Sửa lỗi', tags: ['bug', 'bug', 'ui'] }, deps);
    expect(t.tags).toEqual(['bug', 'ui']);
  });
});

describe('createTicket - luật validate', () => {
  it('title rỗng thì ném ValidationError', () => {
    expect(() => createTicket({ title: '' }, deps)).toThrow(ValidationError);
  });

  it('title toàn khoảng trắng cũng ném ValidationError', () => {
    expect(() => createTicket({ title: '   ' }, deps)).toThrow(ValidationError);
  });
});

describe('updateTicket', () => {
  const base = (): Ticket[] => [
    createTicket({ title: 'A', tags: ['bug'] }, deps),
    { ...createTicket({ title: 'B' }, deps), id: 'T-2' },
  ];

  it('đổi status sang giá trị hợp lệ', () => {
    const updated = updateTicket(base(), 'T-1', { status: 'done' });
    expect(updated.find((t) => t.id === 'T-1')!.status).toBe('done');
  });

  it('đổi status sang giá trị ngoài tập thì ném ValidationError', () => {
    expect(() =>
      updateTicket(base(), 'T-1', { status: 'xong-roi' as never })
    ).toThrow(ValidationError);
  });

  it('id không tồn tại thì ném NotFoundError', () => {
    expect(() => updateTicket(base(), 'T-999', { status: 'done' })).toThrow(NotFoundError);
  });

  it('chỉ truyền một field thì các field khác giữ nguyên', () => {
    const updated = updateTicket(base(), 'T-1', { status: 'done' });
    const t = updated.find((x) => x.id === 'T-1')!;
    expect(t.title).toBe('A');
    expect(t.tags).toEqual(['bug']);
  });

  it('title mới rỗng thì bị từ chối, cùng luật với create', () => {
    expect(() => updateTicket(base(), 'T-1', { title: '   ' })).toThrow(ValidationError);
  });

  it('update ticket này không làm hỏng ticket kia', () => {
    const updated = updateTicket(base(), 'T-1', { status: 'done' });
    expect(updated.find((t) => t.id === 'T-2')!.status).toBe('open');
  });
});
