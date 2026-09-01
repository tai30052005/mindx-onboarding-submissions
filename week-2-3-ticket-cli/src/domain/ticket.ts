import { ValidationError } from '../errors';

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
    tags: input.tags ?? [],
    createdAt: deps.now().toISOString(),
  };
}

function assertValidTitle(title: string): void {
  if (title.trim() === '') {
    throw new ValidationError('title không được rỗng');
  }
}
