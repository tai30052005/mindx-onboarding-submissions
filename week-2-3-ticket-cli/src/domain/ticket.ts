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
 * Nhung thu den tu ben ngoai ham. Tiem vao chu khong goi thang trong ham.
 * Ly do: neu ham tu goi randomUUID() va new Date() thi id ngau nhien, test chi
 * viet duoc toBeDefined() - assertion yeu. Tiem vao thi assert duoc gia tri chinh xac.
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

/** Tra ve danh sach MOI, khong sua truc tiep danh sach cu. */
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
