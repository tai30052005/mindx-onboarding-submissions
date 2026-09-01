import { createTicket, assertValidPriority, Priority } from '../domain/ticket';
import { docFlags } from './flags';
import { RunDeps } from './deps';

export function runCreate(args: string[], deps: RunDeps): number {
  const flags = docFlags(args);

  if (flags.priority !== undefined) assertValidPriority(flags.priority);

  const ticket = createTicket(
    {
      title: flags.title ?? '',
      description: flags.description,
      priority: flags.priority as Priority | undefined,
      tags: flags.tags,
    },
    { now: deps.now, generateId: deps.generateId }
  );

  deps.store.save([...deps.store.load(), ticket]);
  deps.log(`Đã tạo ${ticket.id}: ${ticket.title}`);
  return 0;
}
