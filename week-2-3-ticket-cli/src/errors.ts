/**
 * Ba loại lỗi riêng biệt, không dùng chung Error.
 * Lý do: test assert theo loại lỗi thì không vỡ khi sửa câu chữ thông báo.
 * Assert theo nội dung message là assertion yếu, xem 05-common-mistakes.md.
 */

/** Người dùng gõ sai: title rỗng, status ngoài tập cho phép. */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/** Người dùng gõ đúng, nhưng thứ họ tìm không tồn tại. */
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

/** File tickets.json trên đĩa bị hỏng, không parse được. */
export class CorruptedStoreError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CorruptedStoreError';
  }
}
