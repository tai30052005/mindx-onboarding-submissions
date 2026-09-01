export type Status = 'open' | 'in-progress' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export type Ticket = {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  tags: string[];
  createdAt: string;
};

/** Nhung thu den tu ben ngoai. Tiem vao de test assert duoc gia tri chinh xac. */
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
  return {
    id: deps.generateId(),
    title: input.title,
    description: input.description ?? '',
    status: 'open',
    priority: input.priority ?? 'medium',
    tags: input.tags ?? [],
    createdAt: deps.now().toISOString(),
  };
}
