import { updateTicket, Priority, Status } from '../domain/ticket';
import { ValidationError } from '../errors';
import { docFlags } from './flags';
import { RunDeps } from './deps';

export function runUpdate(args: string[], deps: RunDeps): number {
  const id = args[0];
  if (!id || id.startsWith('--')) {
    throw new ValidationError('thiếu id. Cách dùng: tickets update <id> --status done');
  }

  const flags = docFlags(args.slice(1));
  const changes = {
    ...(flags.title !== undefined && { title: flags.title }),
    ...(flags.description !== undefined && { description: flags.description }),
    ...(flags.status !== undefined && { status: flags.status as Status }),
    ...(flags.priority !== undefined && { priority: flags.priority as Priority }),
    ...(flags.tags !== undefined && { tags: flags.tags }),
  };

  if (Object.keys(changes).length === 0) {
    throw new ValidationError('không có field nào để sửa');
  }

  deps.store.save(updateTicket(deps.store.load(), id, changes));
  deps.log(`Đã cập nhật ${id}`);
  return 0;
}
