import {
  assertValidPriority,
  assertValidStatus,
  createTicket,
  updateTicket,
  Priority,
  Status,
} from '../domain/ticket';
import { filterTickets, formatLine } from '../domain/filter';
import { TicketStore } from '../storage/ticket-store';
import { CorruptedStoreError, NotFoundError, ValidationError } from '../errors';

export type RunDeps = {
  store: TicketStore;
  now: () => Date;
  generateId: () => string;
  log: (message: string) => void;
};

const HUONG_DAN = `Cách dùng:
  tickets create --title <title> [--description <text>] [--priority low|medium|high] [--tag <tag>]...
  tickets list [--status <status>] [--priority <priority>] [--tag <tag>]...
  tickets show <id>
  tickets update <id> [--title <title>] [--status <status>] [--priority <priority>]`;

/**
 * Tra ve EXIT CODE, khong tu goi process.exit().
 * Ly do: process.exit() trong test se tat luon tien trinh Jest, cac test con lai
 * khong chay nua. Chi entrypoint moi duoc goi process.exit(run(argv)).
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

function runCreate(args: string[], deps: RunDeps): number {
  const flags = docFlags(args);

  const title = flags.title ?? '';
  const priority = flags.priority;
  if (priority !== undefined) assertValidPriority(priority);

  const ticket = createTicket(
    {
      title,
      description: flags.description,
      priority: priority as Priority | undefined,
      tags: flags.tags,
    },
    { now: deps.now, generateId: deps.generateId }
  );

  deps.store.save([...deps.store.load(), ticket]);
  deps.log(`Đã tạo ${ticket.id}: ${ticket.title}`);
  return 0;
}

function runList(args: string[], deps: RunDeps): number {
  const flags = docFlags(args);
  if (flags.status !== undefined) assertValidStatus(flags.status);
  if (flags.priority !== undefined) assertValidPriority(flags.priority);

  const ket_qua = filterTickets(deps.store.load(), {
    status: flags.status as Status | undefined,
    priority: flags.priority as Priority | undefined,
    tags: flags.tags,
  });

  if (ket_qua.length === 0) {
    deps.log('Chưa có ticket nào khớp.');
    return 0;
  }

  ket_qua.forEach((t) => deps.log(formatLine(t)));
  return 0;
}

function runShow(args: string[], deps: RunDeps): number {
  const id = args[0];
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

function runUpdate(args: string[], deps: RunDeps): number {
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

type Flags = {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  tags?: string[];
};

/** Doc argv thanh cac flag. Gia tri tu argv luon la CHUOI, nen phai kiem lai kieu. */
function docFlags(args: string[]): Flags {
  const flags: Flags = {};
  const tags: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const value = args[i + 1];

    switch (arg) {
      case '--title':
        flags.title = value ?? '';
        i++;
        break;
      case '--description':
        flags.description = value ?? '';
        i++;
        break;
      case '--status':
        flags.status = value ?? '';
        i++;
        break;
      case '--priority':
        flags.priority = value ?? '';
        i++;
        break;
      case '--tag':
        if (value !== undefined) tags.push(value);
        i++;
        break;
    }
  }

  if (tags.length > 0) flags.tags = tags;
  return flags;
}
