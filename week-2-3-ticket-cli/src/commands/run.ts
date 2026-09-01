import { CorruptedStoreError, NotFoundError, ValidationError } from '../errors';
import { runCreate } from './create';
import { runList } from './list';
import { runShow } from './show';
import { runUpdate } from './update';
import { RunDeps } from './deps';

export { RunDeps };

const HUONG_DAN = `Cách dùng:
  tickets create --title <title> [--description <text>] [--priority low|medium|high] [--tag <tag>]...
  tickets list [--status <status>] [--priority <priority>] [--tag <tag>]...
  tickets show <id>
  tickets update <id> [--title <title>] [--status <status>] [--priority <priority>]`;

/**
 * Tra ve EXIT CODE, khong tu goi process.exit().
 * Ly do: process.exit() trong test se tat luon tien trinh Jest, cac test con lai
 * khong chay nua. Chi entrypoint (index.ts) moi duoc goi process.exit(run(argv)).
 */
export function run(argv: string[], deps: RunDeps): number {
  const [command, ...rest] = argv;

  try {
    switch (command) {
      case 'create':
        return runCreate(rest, deps);
      case 'list':
        return runList(rest, deps);
      case 'show':
        return runShow(rest, deps);
      case 'update':
        return runUpdate(rest, deps);
      default:
        deps.log(HUONG_DAN);
        return 1;
    }
  } catch (err) {
    return baoLoi(err, deps);
  }
}

/** Ba loai loi -> ba exit code khac nhau, de script goi CLI phan biet duoc. */
function baoLoi(err: unknown, deps: RunDeps): number {
  if (err instanceof ValidationError) {
    deps.log(`Lỗi: ${err.message}`);
    return 2;
  }
  if (err instanceof NotFoundError) {
    deps.log(`Lỗi: ${err.message}`);
    return 3;
  }
  if (err instanceof CorruptedStoreError) {
    deps.log(`Lỗi: ${err.message}`);
    deps.log('File chưa bị ghi đè. Mở ra xem rồi sửa tay, hoặc xoá đi để bắt đầu lại.');
    return 4;
  }
  throw err;
}
