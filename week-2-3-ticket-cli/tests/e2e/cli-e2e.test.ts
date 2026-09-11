import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/**
 * Test e2e: gõ đúng lệnh ghi trong package.json, như người dùng gõ.
 *
 * Khác với mọi test còn lại trong thư mục này: không import hàm nào của src.
 * Nó khởi động cả chương trình bằng một tiến trình riêng, nên bắt được những lỗi
 * chỉ xuất hiện lúc nối lệnh vào chương trình - ví dụ import sai đường dẫn.
 */

const root = join(__dirname, '..', '..');

let workDir: string;

beforeEach(() => {
  workDir = mkdtempSync(join(tmpdir(), 'tickets-e2e-'));
});

afterEach(() => {
  rmSync(workDir, { recursive: true, force: true });
});

function runCli(args: string[]) {
  return spawnSync('npm', ['run', 'tickets', '--silent', '--', ...args], {
    cwd: root,
    env: { ...process.env, TICKETS_FILE: join(workDir, 'tickets.json') },
    encoding: 'utf8',
    shell: true,
  });
}

describe('lenh `npm run tickets` ghi trong package.json', () => {
  it('chay duoc lenh list tren kho rong, exit code 0', () => {
    const r = runCli(['list']);

    expect(r.stderr).not.toContain('ERR_MODULE_NOT_FOUND');
    expect(r.status).toBe(0);
  });

  it('tao duoc ticket roi list ra thay no', () => {
    const created = runCli(['create', '--title', 'Ticket e2e']);
    expect(created.status).toBe(0);
    expect(created.stdout).toContain('Ticket e2e');

    const listed = runCli(['list']);
    expect(listed.status).toBe(0);
    expect(listed.stdout).toContain('Ticket e2e');
  });

  it('input sai thi tra ve exit code 2', () => {
    const r = runCli(['create', '--title', '   ']);

    expect(r.status).toBe(2);
  });
});
