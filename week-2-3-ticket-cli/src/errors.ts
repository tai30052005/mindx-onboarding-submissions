/**
 * Ba loai loi rieng biet, khong dung chung Error.
 * Ly do: test assert theo LOAI loi thi khong vo khi sua cau chu thong bao.
 * Assert theo noi dung message la weak assertion - xem 05-common-mistakes.md.
 */

/** Nguoi dung go sai: title rong, status ngoai tap cho phep... */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/** Nguoi dung go dung, nhung thu ho tim khong ton tai. */
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

/** File tickets.json tren dia bi hong, khong parse duoc. */
export class CorruptedStoreError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CorruptedStoreError';
  }
}
