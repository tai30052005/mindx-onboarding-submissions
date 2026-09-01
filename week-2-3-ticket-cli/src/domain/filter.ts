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
  // Luon co hai dau cach giua cac cot, de id dai khong dinh vao cot sau.
  // Bug nay chi lo ra khi chay that voi id 8 ky tu, test cu dung id 'T-1' nen khong bat duoc.
  return [
    t.id.padEnd(8),
    t.status.padEnd(11),
    t.priority.padEnd(6),
    t.title,
  ].join('  ');
}
