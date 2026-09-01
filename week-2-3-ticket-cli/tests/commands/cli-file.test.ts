import { mkdtempSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { run } from '../../src/commands/run';
import { JsonTicketStore } from '../../src/storage/json-store';

// INTEGRATION test: cac test nay di qua bien that la he thong file.
// Moi test mot thu muc tam rieng, khong test nao ghi de len test nao.
describe('CLI chạy với file JSON thật', () => {
  let dir: string;
  let file: string;

  const setup = () => {
    const out: string[] = [];
    return {
      out,
      deps: {
        store: new JsonTicketStore(file),
        now: () => new Date('2026-09-01T10:00:00.000Z'),
        generateId: () => 'T-1',
        log: (m: string) => out.push(m),
      },
    };
  };

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'cli-'));
    file = join(dir, 'tickets.json');
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it('create khi file chưa tồn tại thì tự tạo file, không văng lỗi', () => {
    const { deps } = setup();
    expect(run(['create', '--title', 'Sửa lỗi đăng nhập'], deps)).toBe(0);
    const luu = JSON.parse(readFileSync(file, 'utf8'));
    expect(luu).toHaveLength(1);
    expect(luu[0].title).toBe('Sửa lỗi đăng nhập');
  });

  it('create rồi list thì thấy ticket vừa tạo', () => {
    const a = setup();
    run(['create', '--title', 'Sửa lỗi đăng nhập'], a.deps);
    const b = setup();
    run(['list'], b.deps);
    expect(b.out.join('\n')).toContain('Sửa lỗi đăng nhập');
  });

  it('show với id không tồn tại thì exit code khác 0', () => {
    const { deps } = setup();
    run(['create', '--title', 'A'], deps);
    expect(run(['show', 'T-999'], deps)).not.toBe(0);
  });

  it('update rồi đọc lại file thì thấy thay đổi đã lưu xuống đĩa', () => {
    const { deps } = setup();
    run(['create', '--title', 'A'], deps);
    run(['update', 'T-1', '--status', 'done'], deps);
    const luu = JSON.parse(readFileSync(file, 'utf8'));
    expect(luu[0].status).toBe('done');
  });

  it('file tickets.json hỏng thì báo lỗi rõ và KHÔNG ghi đè', () => {
    const noiDungHong = '{ đây không phải json';
    writeFileSync(file, noiDungHong);
    const { deps, out } = setup();

    const code = run(['list'], deps);

    expect(code).not.toBe(0);
    expect(out.join('\n')).toContain('file dữ liệu hỏng');
    expect(readFileSync(file, 'utf8')).toBe(noiDungHong);
  });

  it('kho rỗng thì list vẫn exit code 0', () => {
    const { deps } = setup();
    expect(run(['list'], deps)).toBe(0);
  });
});
