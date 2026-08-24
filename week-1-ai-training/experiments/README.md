# Experiments

Bốn thí nghiệm tự chạy trong tuần 1. Mục đích không phải làm project — mentor đã chốt
ngày 17/08 rằng tuần 1 snippet là đủ — mà là **kiểm chứng bằng cách chạy thật** thay vì
tin lời AI. Kết quả của chúng được dẫn trong `02`, `03`, `04`, `05` và
`ai-workflow-log.md`.

| Thư mục | Kiểm chứng điều gì | Kết luận |
|---|---|---|
| `tdd-loop/` | Đi đủ vòng Red → Green → Refactor, và thử phá code xem test có bắt được không | Đổi `title` thành `title.trim()` — hành vi đã khác mà 3/3 test vẫn xanh. Test chỉ bảo vệ đúng những gì nó khẳng định |
| `speed/` | Unit test và integration test thật sự chênh nhau bao nhiêu | Unit 0.05–0.13ms, integration ghi/đọc file thật 1.0–2.5ms, khởi động tiến trình ~88ms. Bác bỏ lập luận "integration chậm nên giết vòng lặp TDD" và làm đổi tỷ lệ đề xuất trong `02` từ 70/25/5 sang 50/45/5 |
| `async-check/` | Hai claim của AI về assertion với hàm async | `expect(() => f()).toThrow()` **không** "im lặng pass" — nó làm chết worker. Và test-last **không** bị ép dùng `toBeDefined()`: fake timer khoá được `createdAt`, `id` assert được bằng định dạng. Cả hai claim sai, đã sửa lại `01`, `03`, `04` |
| `update-command/` | Viết đủ file test cho một lệnh (`tickets update`) thay vì snippet rời, xem kế hoạch ở `03` có đủ chi tiết để dịch thẳng ra test không | 7 ca trong kế hoạch ra 24 test (23 + 1 `it.todo`). Hai chỗ kế hoạch còn thiếu: tags mới thay thế hay nối thêm, và thiếu file `tickets.json` khi update |
| `refinement/` | Buổi Iterative Refinement — file test có lỗi cài sẵn, và bản mình sửa lại | Tự tìm được 1/10 lỗi. Xem `05-common-mistakes.md` mục Provenance |

## Cách chạy

`tdd-loop/` và `speed/` không cần cài gì — Node 24 có sẵn test runner và chạy được
TypeScript:

```bash
node --test ticket.test.js
node --test ticket.test.ts
node --test bench.test.js
```

`async-check/` cần Jest thật vì nó kiểm chính hành vi của Jest:

```bash
npm init -y && npm i -D jest && npx jest
```

`refinement/` và `update-command/` là các file để đọc và đối chiếu, không chạy được — chúng
import từ `src/domain/ticket`, `src/storage/json-store` và `src/commands/update`, tức là code của
tuần 2 chưa tồn tại.
