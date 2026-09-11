import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/**
 * Test e2e: khoi dong ca chuong trinh bang mot tien trinh rieng.
 *
 * Khac voi moi test con lai trong thu muc nay: khong import ham nao cua src.
 * Nen no bat duoc nhung loi chi xuat hien luc noi lenh vao chuong trinh,
 * vi du import sai duong dan - thu ma 50 test kia deu khong thay.
 */

const root = join(__dirname, '..', '..');
const entry = join(root, 'dist', 'index.js');
const tsc = join(root, 'node_modules', 'typescript', 'bin', 'tsc');

let workDir: string;

beforeAll(() => {
  const build = spawnSync(process.execPath, [tsc], { cwd: root, encoding: 'utf8' });
  if (build.status !== 0) throw new Error(`tsc that bai:\n${build.stdout}${build.stderr}`);
}, 60_000);

beforeEach(() => {
  workDir = mkdtempSync(join(tmpdir(), 'tickets-e2e-'));
});

afterEach(() => {
  rmSync(workDir, { recursive: true, force: true });
});

function env() {
  return { ...process.env, TICKETS_FILE: join(workDir, 'tickets.json') };
}

describe('lenh `npm run tickets` ghi trong package.json', () => {
  it('khoi dong duoc, khong chet o dong import', () => {
    // Test nay la cai bat duoc bug ngay 11/09: script tro vao src/index.ts, ma
    // Node coi file do la ESM nen doi import phai co duoi file. Chet truoc khi
    // chay duoc dong logic nao, trong khi 50 test kia van xanh.
    const r = spawnSync('npm run tickets --silent -- list', {
      cwd: root,
      env: env(),
      encoding: 'utf8',
      shell: true,
    });

    expect(r.stderr).not.toContain('ERR_MODULE_NOT_FOUND');
    expect(r.status).toBe(0);
  });
});

describe('chuong trinh da build, goi truc tiep', () => {
  // Goi thang node dist/index.js, khong qua npm, de tham so khong bi cmd.exe
  // boc them dau thoat. Di qua npm.cmd tren Windows thi "Ticket e2e" bi cat doi.
  function runCli(args: string[]) {
    return spawnSync(process.execPath, [entry, ...args], {
      cwd: root,
      env: env(),
      encoding: 'utf8',
    });
  }

  it('tao duoc ticket roi list ra thay no', () => {
    const created = runCli(['create', '--title', 'Ticket e2e']);
    expect(created.status).toBe(0);
    expect(created.stdout).toContain('Ticket e2e');

    const listed = runCli(['list']);
    expect(listed.status).toBe(0);
    expect(listed.stdout).toContain('Ticket e2e');
  });

  it('title toan khoang trang thi tra ve exit code 2', () => {
    const r = runCli(['create', '--title', '   ']);

    expect(r.status).toBe(2);
  });

  it('id khong ton tai thi tra ve exit code 3', () => {
    const r = runCli(['show', 'khong-co-that']);

    expect(r.status).toBe(3);
  });
});
