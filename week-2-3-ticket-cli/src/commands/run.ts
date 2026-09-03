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
 * Trả về exit code, không tự gọi process.exit().
 * Lý do: process.exit() trong test sẽ tắt luôn tiến trình Jest, các test còn lại
 * không chạy nữa. Chỉ entrypoint (index.ts) mới được gọi process.exit(run(argv)).
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

/** Ba loại lỗi cho ba exit code khác nhau, để script gọi CLI phân biệt được. */
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
