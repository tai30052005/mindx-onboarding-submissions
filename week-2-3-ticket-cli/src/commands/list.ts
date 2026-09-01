import { assertValidPriority, assertValidStatus, Priority, Status } from '../domain/ticket';
import { filterTickets, formatLine } from '../domain/filter';
import { docFlags } from './flags';
import { RunDeps } from './deps';

export function runList(args: string[], deps: RunDeps): number {
  const flags = docFlags(args);
  if (flags.status !== undefined) assertValidStatus(flags.status);
  if (flags.priority !== undefined) assertValidPriority(flags.priority);

  const ketQua = filterTickets(deps.store.load(), {
    status: flags.status as Status | undefined,
    priority: flags.priority as Priority | undefined,
    tags: flags.tags,
  });

  // Loc khong khop gi la chuyen binh thuong, khong phai loi -> van tra 0.
  if (ketQua.length === 0) {
    deps.log('Chưa có ticket nào khớp.');
    return 0;
  }

  ketQua.forEach((t) => deps.log(formatLine(t)));
  return 0;
}
