# Thí nghiệm

Bốn thí nghiệm tự chạy trong tuần 1. Mục đích không phải làm project, vì mentor đã chốt
ngày 17/08 rằng tuần 1 snippet là đủ. Mục đích là **kiểm chứng bằng cách chạy thật**
thay vì tin lời AI.

**Không cần cài gì.** Node 24 có sẵn test runner và chạy được TypeScript.

| Thư mục | Kiểm chứng điều gì | Kết luận |
|---|---|---|
| `tdd-loop/` | Đi đủ vòng Red → Green → Refactor, rồi cố tình phá code xem test có bắt được không | Đổi `title` thành `title.trim()` — hành vi đã khác mà 3/3 test vẫn xanh. Test chỉ bảo vệ đúng những gì nó có khẳng định |
| `speed/` | Unit test và integration test chênh nhau bao nhiêu | Chạy xong nó tự in bảng kết quả. Integration chậm hơn unit vài chục lần, nhưng về tuyệt đối vẫn rẻ — 500 test dưới 1 giây. Bác bỏ lập luận "integration chậm nên giết vòng lặp TDD", và làm đổi tỷ lệ trong `02` từ 70/25/5 sang 50/45/5 |
| `async-check/` | Hai claim về test cho hàm async | Quên `await` thì test **xanh giả** — vẫn xanh dù khẳng định trong đó sai hoàn toàn. Và test viết sau **không** bị ép dùng `toBeDefined()`: khoá đồng hồ lại thì assert được giá trị chính xác |
| `refinement/` | Buổi Iterative Refinement — file test có lỗi cài sẵn, và bản mình sửa lại | Lần đầu tự tìm được 0/10; đọc lại cuối tuần tự tìm được 5/6 ở nửa đầu file. Xem `05-common-mistakes.md` mục "Cái gì mình tự tìm ra" |

## Cách chạy

```bash
node --test tdd-loop/ticket.test.js
node --test tdd-loop/ticket.test.ts
node --test speed/bench.test.js
node --test async-check/faketimer.test.js
node --test async-check/async-test.test.js
```

`tdd-loop/HUONG-DAN.md` là bài đi từng bước qua vòng Red-Green-Refactor. Sửa một dòng,
chạy lại, xem màu đổi.

`async-check/async-test.test.js` **cố ý có một test đỏ**. Kết quả đúng là 2 pass, 1 fail.
Cái đỏ đó để so với cái xanh giả ở ngay trên nó: cùng một khẳng định sai, nhưng viết
thiếu `await` thì xanh, viết đủ `await` thì đỏ.

`refinement/` là hai file để đọc và đối chiếu, không chạy được, vì chúng import từ
`src/domain/ticket` và `src/storage/json-store`, tức là code của tuần 2 chưa tồn tại.
