import { Priority, Status, Ticket } from './ticket';

export type Filter = {
  status?: Status;
  priority?: Priority;
  tags?: string[];
};

/**
 * Ham thuan: dau vao la mang co san, dau ra la mang moi.
 * Khong doc file, khong xem gio -> khong ra ngoai chuong trinh -> unit test duoc.
 */
export function filterTickets(tickets: Ticket[], filter: Filter): Ticket[] {
  return tickets.filter((t) => {
    if (filter.status && t.status !== filter.status) return false;
    if (filter.priority && t.priority !== filter.priority) return false;
    // Nhieu tag thi lay tap GIAO: ticket phai co DU tat ca cac tag duoc hoi.
    if (filter.tags && !filter.tags.every((tag) => t.tags.includes(tag))) return false;
    return true;
  });
}

export function formatLine(t: Ticket): string {
  // Cot co do rong co dinh cho de doc khi liet ke nhieu dong.
  return t.id.padEnd(6) + t.status.padEnd(13) + t.priority.padEnd(8) + t.title;
}
