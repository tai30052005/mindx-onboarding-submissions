import { Priority, Status, Ticket } from './ticket';

export type Filter = {
  status?: Status;
  priority?: Priority;
  tags?: string[];
};

/**
 * Hàm thuần: đầu vào là mảng có sẵn, đầu ra là mảng mới.
 * Không đọc file, không xem giờ, tức là không ra ngoài chương trình, nên unit test được.
 */
export function filterTickets(tickets: Ticket[], filter: Filter): Ticket[] {
  return tickets.filter((t) => {
    if (filter.status && t.status !== filter.status) return false;
    if (filter.priority && t.priority !== filter.priority) return false;
    // Nhiều tag thì lấy tập giao: ticket phải có đủ tất cả các tag được hỏi.
    if (filter.tags && !filter.tags.every((tag) => t.tags.includes(tag))) return false;
    return true;
  });
}

export function formatLine(t: Ticket): string {
  // Luôn có hai dấu cách giữa các cột, để id dài không dính vào cột sau.
  // Bug này chỉ lộ ra khi chạy thật với id 8 ký tự. Test cũ dùng id 'T-1' nên không bắt được.
  return [
    t.id.padEnd(8),
    t.status.padEnd(11),
    t.priority.padEnd(6),
    t.title,
  ].join('  ');
}
