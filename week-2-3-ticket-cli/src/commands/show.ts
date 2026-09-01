import { NotFoundError, ValidationError } from '../errors';
import { RunDeps } from './deps';

export function runShow(args: string[], deps: RunDeps): number {
  const id = args[0];

  // Thieu id la nguoi dung GO SAI -> ValidationError.
  // Con id dung dinh dang ma khong co trong kho la NotFoundError. Hai chuyen khac nhau.
  if (!id || id.startsWith('--')) {
    throw new ValidationError('thiếu id. Cách dùng: tickets show <id>');
  }

  const ticket = deps.store.load().find((t) => t.id === id);
  if (!ticket) {
    throw new NotFoundError(`không tìm thấy ticket ${id}`);
  }

  deps.log(`id:          ${ticket.id}`);
  deps.log(`title:       ${ticket.title}`);
  deps.log(`description: ${ticket.description}`);
  deps.log(`status:      ${ticket.status}`);
  deps.log(`priority:    ${ticket.priority}`);
  deps.log(`tags:        ${ticket.tags.join(', ')}`);
  deps.log(`createdAt:   ${ticket.createdAt}`);
  return 0;
}
