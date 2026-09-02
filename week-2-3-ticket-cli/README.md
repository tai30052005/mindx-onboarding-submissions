# Tuần 2 — Ticket Manager CLI

CLI quản lý ticket, lưu vào file JSON trên máy. Làm theo TDD: viết test đỏ trước, rồi mới
viết code cho xanh.

Kế hoạch test của CLI này viết từ tuần 1, ở
[`../week-1-ai-training/03-cli-test-plan.md`](../week-1-ai-training/03-cli-test-plan.md).
Tuần 2 là thực thi đúng kế hoạch đó.

## Cài đặt

Cần Node 18 trở lên. Kiểm bằng `node --version`.

```bash
cd week-2-3-ticket-cli
npm install
```

## Chạy test

```bash
npm test          # chạy một lượt
npm run test:watch   # chạy lại mỗi lần lưu file
```

## Build rồi dùng

```bash
npm run build
node dist/index.js list
```

## Cấu hình

Mặc định ticket lưu vào `tickets.json` trong thư mục đang đứng. Đổi bằng biến môi trường:

```bash
TICKETS_FILE=/duong/dan/khac.json node dist/index.js list
```

## Bốn lệnh

```bash
# tạo
node dist/index.js create --title "Sửa lỗi đăng nhập" --priority high --tag bug

# liệt kê, kèm lọc
node dist/index.js list
node dist/index.js list --status open
node dist/index.js list --priority high --tag bug

# xem chi tiết
node dist/index.js show <id>

# sửa
node dist/index.js update <id> --status done
```

`status` nhận `open`, `in-progress`, `done`. `priority` nhận `low`, `medium`, `high`.

## Exit code

Ba loại lỗi ba mã khác nhau, để script gọi CLI phân biệt được:

| Mã | Nghĩa |
|---|---|
| 0 | chạy ổn |
| 1 | lệnh không tồn tại |
| 2 | input sai (title rỗng, status ngoài tập cho phép) |
| 3 | không tìm thấy ticket |
| 4 | file `tickets.json` hỏng |

Mã 3 tách khỏi mã 2 là có chủ đích: `show ""` là người dùng gõ sai, còn `show T-999` là
người dùng gõ đúng nhưng thứ họ tìm không tồn tại. Hai chuyện khác nhau nên hai thông báo
khác nhau.

Gặp file hỏng (mã 4) thì chương trình **không ghi đè** lên file đó. Ghi đè là làm mất dữ
liệu người dùng.

## Cấu trúc

```
src/
  errors.ts               ba loại lỗi riêng, không dùng chung Error
  domain/ticket.ts        tạo và sửa ticket, luật validate
  domain/filter.ts        lọc danh sách, format dòng output
  storage/ticket-store.ts interface, tầng lệnh chỉ biết đến cái này
  storage/json-store.ts   đọc/ghi file JSON thật
  storage/in-memory-store.ts  bản giả dùng trong test
  commands/run.ts         bốn lệnh, trả về exit code
  index.ts                entrypoint, chỗ duy nhất gọi process.exit()

tests/
  domain/                 unit test, chạy thuần trong bộ nhớ
  storage/                integration test, ghi đọc file thật trong thư mục tạm
  commands/run.test.ts    unit test tầng lệnh, dùng kho trong bộ nhớ
  commands/cli-file.test.ts   integration test, chạy lệnh với file thật
```

## Ba quyết định thiết kế

Ba cái này chốt từ tuần 1, và cả ba đều xuất phát từ chuyện **viết test thế nào cho được**.

**1. `id` và `createdAt` tiêm vào, không gọi thẳng trong hàm.**
Nếu hàm tự gọi `randomUUID()` và `new Date()` thì `id` ngẫu nhiên, test chỉ viết được
`expect(t.id).toBeDefined()`, mà câu đó xanh với cả `"abcxyz"` lẫn `0`. Tiêm vào thì
test truyền `generateId: () => 'T-1'`, assert được giá trị chính xác.

**2. Hàm trả về exit code, không tự gọi `process.exit()`.**
`process.exit()` tắt ngay tiến trình đang chạy. Test chạy trong tiến trình Jest, nên một
test gọi `process.exit()` sẽ tắt luôn Jest và các test còn lại không chạy nữa. Chỉ
`index.ts` được gọi nó.

**3. Mỗi integration test một thư mục tạm riêng.**
Jest chạy nhiều worker song song. Dùng chung một file `tickets.json` thì các test ghi đè
lên nhau, test đỏ mà code không sai gì.

## Tiêu chí chấm → nằm ở đâu

| Tiêu chí | Nằm ở đâu |
|---|---|
| Thấy được vòng TDD: test đỏ → code → test xanh → refactor | `git log` — commit `test(...)` đứng trước commit `feat(...)` |
| CLI chạy được 4 lệnh | `src/commands/run.ts`, mục *Bốn lệnh* ở trên |
| Unit test cho logic và luật validate | `tests/domain/` |
| Integration test cho lưu JSON và hành vi lệnh | `tests/storage/`, `tests/commands/cli-file.test.ts` |
| Test ba ca lỗi | input sai + không tìm thấy: `tests/commands/run.test.ts`; file thiếu/hỏng: `tests/storage/json-store.test.ts` |
| Hướng dẫn cài đặt, cấu hình, sử dụng | file này |
| Trả lời được câu hỏi dựa trên research và implementation | *(hỏi trực tiếp)* — chưa xong |
