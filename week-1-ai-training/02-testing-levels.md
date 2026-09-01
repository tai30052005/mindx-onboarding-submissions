# Ba tầng test: unit, integration, end-to-end

> **Deliverable 2.** Workflow đã dùng: Layered Questioning, rồi một vòng review đối kháng
> ở phiên AI mới. Vòng review đó làm đổi tỷ lệ mình đề xuất — chi tiết ở
> `ai-workflow-log.md`.

## Ba tầng khác nhau chỗ nào

Unit test là test chạy trong chương trình mình.
Integration test là test phải ra ngoài chương trình.
End-to-end thì không gọi hàm nào cả — nó chạy cả chương trình luôn, như người dùng
gõ lệnh vào terminal.

Ra ngoài chương trình thì test bị chậm, kết quả không đoán được, và các test ghi đè
lên nhau.

Đĩa, mạng, đồng hồ hệ thống, số ngẫu nhiên — bốn thứ này cùng một nhóm không phải vì
chúng giống nhau, mà vì **đều ở ngoài chương trình**. Nên đều dính đủ ba chuyện trên.

Cần e2e vì unit xanh hết, integration xanh hết mà gõ lệnh vẫn hỏng — ví dụ quên nối
lệnh vào chương trình.

## Số đo

Tự chạy `experiments/speed/bench.test.js`: 5 test chạy thuần trong bộ nhớ và 5 test ghi
đọc file thật, đo trong cùng một lượt.

| | Thời gian mỗi test |
|---|---|
| Unit | 0.023 ms |
| Integration (ghi đọc file thật) | 0.729 ms |
| End-to-end (khởi động tiến trình) | ~88 ms |

Lần chạy này integration chậm hơn unit **32 lần**. Chạy lại vài lượt thì con số đó nhảy
trong khoảng 18–59 lần, vì nó phụ thuộc tải máy lúc đó. Thứ không đổi giữa các lượt: unit
luôn nhanh hơn hẳn, và integration về tuyệt đối vẫn rẻ — 500 test vẫn dưới 1 giây.

Lần đo đầu mỗi nhóm bỏ không tính, vì lúc đó Node còn đang khởi động. Trong output ở trên
nó hiện rõ: `UNIT 1` mất 5ms còn `UNIT 3` chỉ 0.09ms.

## Tỷ lệ giữa ba tầng, và vì sao mình đổi

**50% unit / 45% integration / 5% end-to-end.**

Ban đầu mình để 70/25/5 vì nghĩ integration chậm. Đo thử thì mỗi test chưa tới 1ms,
500 test vẫn dưới 1 giây. Nên lý do "chậm" không đứng được, và mình đổi thành 50/45/5.

Lý do thật để giữ unit ở tỷ trọng cao là chuyện khác: **unit đỏ thì biết sai ở đâu,
còn integration đỏ thì phải tự tìm.** Integration chạy qua cả logic lẫn chỗ lưu file,
nên nó đỏ thì lỗi có thể ở logic, cũng có thể ở chỗ lưu file.

Còn vì sao không viết toàn e2e cho chắc: e2e đắt gấp khoảng 40 lần integration, và đỏ
thì cũng không chỉ được nguyên nhân.

## Phân loại ví dụ thật

Mười ba test case lấy từ phạm vi thật của Ticket Manager CLI.

**Hai ghi chú phải đọc trước khi xem bảng:**

- Bảng này **không** phải mẫu theo tỷ lệ 50/45/5 ở trên. Nó chọn theo độ đa dạng của tình
  huống, không theo tỷ trọng.
- Phân loại giả định `id`, `createdAt` và tầng lưu trữ được **tiêm vào** chứ không gọi
  trực tiếp bên trong hàm. Nếu tuần 2 không làm vậy — nếu `createTicket` tự gọi
  `randomUUID()` và `new Date()` — thì ba dòng đầu tụt xuống integration, vì lúc đó chúng
  chạm đồng hồ và bộ sinh ngẫu nhiên. Đây là ràng buộc thiết kế chưa cam kết, không phải
  sự thật đã có.

| # | Test case | Tầng | Vì sao |
|---|---|---|---|
| 1 | `createTicket` với `title` rỗng thì ném lỗi | Unit | Thuần luật validate, không biên nào |
| 2 | Ticket mới tạo có `status` mặc định là `open` | Unit | Quy tắc nghiệp vụ trong bộ nhớ — với điều kiện clock/id được tiêm |
| 3 | `id` sinh ra theo bộ sinh được tiêm, không phải ngẫu nhiên thật | Unit | Chính vì đã tiêm nên assert được giá trị chính xác thay vì `toBeDefined()` |
| 4 | Lọc một mảng ticket có sẵn theo `status = open` | Unit | Hàm lọc thuần, đầu vào là mảng chứ không phải file |
| 5 | Lọc theo nhiều `tags` cùng lúc trả về đúng tập giao | Unit | Logic tập hợp trên dữ liệu trong bộ nhớ |
| 6 | `tickets update` đổi `status` sang giá trị hợp lệ trên object trong bộ nhớ | Unit | Chuyển trạng thái là logic nghiệp vụ thuần |
| 7 | `tickets update` sang `status` không hợp lệ thì bị từ chối | Unit | Luật chuyển trạng thái, không cần file |
| 8 | Chuỗi JSON hỏng cú pháp, nạp thẳng vào parser trong bộ nhớ, thì báo lỗi rõ | Unit | Chỉ test khả năng xử lý nội dung hỏng — chưa có `fs` nào tham gia |
| 9 | Format một dòng bảng output từ một ticket object | Unit | Hàm thuần từ dữ liệu ra chuỗi |
| 10 | Ghi ticket xuống file JSON rồi đọc lại ra đúng ticket đó | Integration | Round-trip qua biên thật là hệ thống file |
| 11 | File `tickets.json` **trên đĩa** hỏng thì báo lỗi rõ, không crash | Integration | Thêm phần đọc file, encoding, quyền truy cập — khác với dòng 8 |
| 12 | File `tickets.json` không tồn tại thì xử lý theo spec, không văng stack trace | Integration | Trạng thái của biên file, không phải của logic |
| 13 | Chạy `tickets create` rồi `tickets list` từ dòng lệnh, kiểm ticket xuất hiện trong stdout | End-to-end | Khởi động tiến trình thật, kiểm đúng thứ người dùng nhìn thấy |

**Hai ca ranh giới, và cách mình xử lý:**

- **`tickets show <id>` với id không tồn tại.** Ranh giới thật ở đây là **unit ↔
  integration**, không phải integration ↔ e2e. Gọi handler với tầng lưu trong bộ nhớ thì
  không qua biên nào → theo trục của mình đó là **unit**, dù về chủ đề nó là "CLI command
  behavior". Chỉ khi đọc từ file thật trên đĩa nó mới thành integration. Mình viết cả
  hai: một unit test cho luật "không tìm thấy thì trả lỗi gì", một integration test cho
  "đọc từ file thật rồi không tìm thấy".
- **`priority` ngoài tập giá trị cho phép.** Ca này tách làm hai. Nếu `priority` là union
  type thì gán sai giá trị trong code chết ở **compile time** — đó là tầng static, không
  phải test. Phần còn lại là chuỗi từ `process.argv` cần thu hẹp kiểu, và việc đó xảy ra
  ở biên CLI. Không mảnh nào của ca này ở lại thành unit test thuần theo cách mình nghĩ
  ban đầu.

## Còn chưa chắc

- Tỷ lệ 50/45/5 mình chọn dựa trên tốc độ, nhưng chưa đo tỉ lệ vỡ unit test. Bảng của
  chính mình ghi unit là tầng dễ vỡ nhất khi refactor — đó là một chi phí chưa cân được
- Ba dòng unit đầu bảng phụ thuộc vào việc `id`/`createdAt`/tầng lưu có được tiêm hay
  không. Đó là quyết định thiết kế của tuần 2, chưa cam kết — nếu làm khác thì bảng phải sửa
- Ranh giới "ngoài chương trình" xử lý gọn cho `fs`, nhưng chưa chắc còn gọn ở tuần 3
  khi có HTTP client giả và HTTP client thật hoán đổi qua biến môi trường
