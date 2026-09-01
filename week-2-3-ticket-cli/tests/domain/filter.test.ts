import { filterTickets, formatLine } from '../../src/domain/filter';
import { Ticket } from '../../src/domain/ticket';

const t = (over: Partial<Ticket>): Ticket => ({
  id: 'T-1',
  title: 'Sửa lỗi',
  description: '',
  status: 'open',
  priority: 'medium',
  tags: [],
  createdAt: '2026-09-01T10:00:00.000Z',
  ...over,
});

const all: Ticket[] = [
  t({ id: 'T-1', status: 'open', priority: 'high', tags: ['bug', 'ui'] }),
  t({ id: 'T-2', status: 'done', priority: 'low', tags: ['bug'] }),
  t({ id: 'T-3', status: 'open', priority: 'low', tags: ['ui', 'api'] }),
];

const ids = (list: Ticket[]) => list.map((x) => x.id);

describe('filterTickets', () => {
  it('không truyền filter thì trả về toàn bộ', () => {
    expect(ids(filterTickets(all, {}))).toEqual(['T-1', 'T-2', 'T-3']);
  });

  it('lọc theo status', () => {
    expect(ids(filterTickets(all, { status: 'open' }))).toEqual(['T-1', 'T-3']);
  });

  it('lọc theo priority', () => {
    expect(ids(filterTickets(all, { priority: 'low' }))).toEqual(['T-2', 'T-3']);
  });

  it('lọc theo một tag', () => {
    expect(ids(filterTickets(all, { tags: ['bug'] }))).toEqual(['T-1', 'T-2']);
  });

  it('lọc theo nhiều tag thì lấy tập GIAO, không phải tập hợp', () => {
    expect(ids(filterTickets(all, { tags: ['bug', 'ui'] }))).toEqual(['T-1']);
  });

  it('lọc không khớp gì thì trả mảng rỗng, không phải lỗi', () => {
    expect(filterTickets(all, { status: 'in-progress' })).toEqual([]);
  });

  it('kết hợp status và priority thì phải thoả cả hai', () => {
    expect(ids(filterTickets(all, { status: 'open', priority: 'low' }))).toEqual(['T-3']);
  });
});

describe('formatLine', () => {
  it('format một ticket thành một dòng đọc được', () => {
    const line = formatLine(t({ id: 'T-1', title: 'Sửa lỗi', status: 'open', priority: 'high' }));
    expect(line).toBe('T-1       open         high    Sửa lỗi');
  });
});

describe('formatLine - id dài không dính vào cột sau', () => {
  it('id 8 ký tự vẫn cách cột status ra', () => {
    const line = formatLine(t({ id: '1529fe0a', status: 'open', priority: 'high' }));
    expect(line).toContain('1529fe0a  open');
  });
});
