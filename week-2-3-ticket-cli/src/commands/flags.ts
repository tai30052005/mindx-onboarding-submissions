export type Flags = {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  tags?: string[];
};

/**
 * Đọc argv thành các flag.
 * Giá trị lấy từ argv luôn là chuỗi, kể cả khi nó phải là status hay priority.
 * Nên đọc xong vẫn phải kiểm lại kiểu ở tầng lệnh.
 */
export function docFlags(args: string[]): Flags {
  const flags: Flags = {};
  const tags: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const value = args[i + 1];

    switch (args[i]) {
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
