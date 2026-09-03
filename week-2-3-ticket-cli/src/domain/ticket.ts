import { ValidationError, NotFoundError } from '../errors';

export type Status = 'open' | 'in-progress' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export const STATUSES: Status[] = ['open', 'in-progress', 'done'];
export const PRIORITIES: Priority[] = ['low', 'medium', 'high'];

export type Ticket = {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  tags: string[];
  createdAt: string;
};

/**
 * Những thứ đến từ bên ngoài hàm. Tiêm vào chứ không gọi thẳng trong hàm.
 * Lý do: nếu hàm tự gọi randomUUID() và new Date() thì id ngẫu nhiên, test chỉ
 * viết được toBeDefined(), là assertion yếu. Tiêm vào thì assert được giá trị chính xác.
 */
export type Deps = {
  now: () => Date;
  generateId: () => string;
};

export type CreateInput = {
  title: string;
  description?: string;
  priority?: Priority;
  tags?: string[];
};

export function createTicket(input: CreateInput, deps: Deps): Ticket {
  assertValidTitle(input.title);

  return {
    id: deps.generateId(),
    title: input.title.trim(),
    description: input.description ?? '',
    status: 'open',
    priority: input.priority ?? 'medium',
    tags: dedupe(input.tags ?? []),
    createdAt: deps.now().toISOString(),
  };
}

function assertValidTitle(title: string): void {
  if (title.trim() === '') {
    throw new ValidationError('title không được rỗng');
  }
}

export type UpdateInput = {
  title?: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  tags?: string[];
};

/** Trả về danh sách mới, không sửa trực tiếp danh sách cũ. */
export function updateTicket(
  tickets: Ticket[],
  id: string,
  changes: UpdateInput
): Ticket[] {
  const target = tickets.find((t) => t.id === id);
  if (!target) {
    throw new NotFoundError(`không tìm thấy ticket ${id}`);
  }

  if (changes.title !== undefined) assertValidTitle(changes.title);
  if (changes.status !== undefined) assertValidStatus(changes.status);
  if (changes.priority !== undefined) assertValidPriority(changes.priority);

  const updated: Ticket = {
    ...target,
    ...(changes.title !== undefined && { title: changes.title.trim() }),
    ...(changes.description !== undefined && { description: changes.description }),
    ...(changes.status !== undefined && { status: changes.status }),
    ...(changes.priority !== undefined && { priority: changes.priority }),
    ...(changes.tags !== undefined && { tags: dedupe(changes.tags) }),
  };

  return tickets.map((t) => (t.id === id ? updated : t));
}

export function assertValidStatus(value: string): asserts value is Status {
  if (!STATUSES.includes(value as Status)) {
    throw new ValidationError(
      `status phải là một trong: ${STATUSES.join(', ')}`
    );
  }
}

export function assertValidPriority(value: string): asserts value is Priority {
  if (!PRIORITIES.includes(value as Priority)) {
    throw new ValidationError(
      `priority phải là một trong: ${PRIORITIES.join(', ')}`
    );
  }
}

function dedupe(tags: string[]): string[] {
  return [...new Set(tags)];
}
