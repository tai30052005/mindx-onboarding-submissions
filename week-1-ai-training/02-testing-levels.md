# Ba tầng test: unit, integration, end-to-end

> **Deliverable 2.** Workflow đã dùng: Layered Questioning, rồi một vòng review đối kháng
> ở phiên AI mới. Vòng review đó làm đổi tỷ lệ mình đề xuất. Chi tiết ở
> `ai-workflow-log.md`.

## Ba tầng khác nhau chỗ nào

Unit test là test chạy trong chương trình mình.
Integration test là test phải ra ngoài chương trình.
End-to-end thì chạy cả chương trình luôn. Unit với integration đều gọi hàm trong code,
còn e2e thì không gọi hàm nào, mình gõ lệnh vào terminal như người dùng.

Ra ngoài chương trình thì test bị chậm, kết quả không đoán được, và các test ghi đè
lên nhau.

Đĩa, mạng, đồng hồ, số ngẫu nhiên cùng một nhóm vì đều ở ngoài chương trình. Nên đều
dính ba chuyện trên.

Cần e2e vì unit xanh hết, integration xanh hết mà gõ lệnh vẫn hỏng, ví dụ vì không nối
lệnh vào chương trình.

## Số đo

Tự chạy `experiments/speed/bench.test.js`: 5 test chạy thuần trong bộ nhớ và 5 test ghi
đọc file thật, đo trong cùng một lượt.

| | Thời gian mỗi test |
|---|---|
| Unit | 0.023 ms |
| Integration (ghi đọc file thật) | 0.729 ms |
| End-to-end (khởi động tiến trình) | ~88 ms |

Lần chạy này integration chậm hơn unit 32 lần. Chạy lại vài lượt thì con số đó nhảy
trong khoảng 18 đến 59 lần, tuỳ máy lúc đó đang tải nặng hay nhẹ. Số thì đổi nhưng unit
lúc nào cũng nhanh hơn nhiều, và 500 integration test vẫn chạy dưới 1 giây.

Lần đo đầu mỗi nhóm bỏ không tính, vì lúc đó Node còn đang khởi động. Chạy thử thì thấy
rõ: `UNIT 1` mất 5ms còn `UNIT 3` chỉ 0.09ms, cùng một đoạn code.

## Tỷ lệ giữa ba tầng, và vì sao mình đổi

**50% unit / 45% integration / 5% end-to-end.**

Ban đầu mình để 70/25/5 vì nghĩ integration chậm. Đo thử thì mỗi test chưa tới 1ms,
500 test vẫn dưới 1 giây. Nên lý do "chậm" không đứng được, và mình đổi thành 50/45/5.

Lý do giữ unit nhiều là unit đỏ thì biết sai ở đâu, còn integration đỏ thì phải tự tìm.
Integration chạy qua cả logic lẫn chỗ lưu file, nên nó đỏ thì lỗi ở logic hoặc ở chỗ
lưu file, mình chưa biết chỗ nào.

Không viết toàn e2e vì nó đắt gấp khoảng 40 lần integration, mà đỏ thì cũng không chỉ
được sai ở đâu.

## Phân loại ví dụ thật

Mười ba test case lấy từ phạm vi thật của Ticket Manager CLI.

**Hai ghi chú phải đọc trước khi xem bảng:**

- Bảng này **không** phải mẫu theo tỷ lệ 50/45/5 ở trên. Nó chọn theo độ đa dạng của tình
  huống, không theo tỷ trọng.
- Phân loại giả định `id`, `createdAt` và tầng lưu trữ được **tiêm vào** chứ không gọi
  trực tiếp bên trong hàm. Nếu làm ngược lại, tức là `createTicket` tự gọi `randomUUID()`
  và `new Date()`, thì ba dòng đầu tụt xuống integration, vì lúc đó chúng chạm đồng hồ và
  bộ sinh ngẫu nhiên. Lúc viết bảng này thì đó mới là ràng buộc chưa cam kết. Tuần 2 làm
  đúng như vậy, xem `Deps` trong `../week-2-3-ticket-cli/src/domain/ticket.ts`.

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

- **`tickets show <id>` với id không tồn tại.** Ca này mình viết **hai** test, và tuần 2
  làm thật rồi: `tests/commands/run.test.ts` chạy với kho trong bộ nhớ,
  `tests/commands/cli-file.test.ts` chạy với file thật.

  Cái trong bộ nhớ là **unit**, vì nó không ra ngoài chương trình. Gọi hàm của chính mình
  thì không tính là đi qua biên, dù về chủ đề nó là "CLI command behavior".

  Sao phải viết cả hai? Vì mỗi cái chứng minh một thứ cái kia không chứng minh được. Cùng
  một lệnh `show T-999` nhưng đường đi khác nhau:

  ```
  trong bộ nhớ:  runShow -> load() -> mảng có sẵn -> tìm -> không có -> báo lỗi
  file thật:     runShow -> load() -> MỞ FILE -> ĐỌC -> PARSE JSON -> mảng -> tìm -> không có -> báo lỗi
  ```

  Test file thật đỏ thì lỗi có thể ở luật "không tìm thấy", hoặc ở ba bước mở/đọc/parse.
  Còn test trong bộ nhớ đỏ thì chỉ có một chỗ để tìm: chính hai dòng quyết định làm gì khi
  không thấy ticket.

  Chiều ngược lại: nếu `JsonTicketStore` hỏng hoàn toàn thì test trong bộ nhớ **vẫn xanh**,
  vì nó không đụng tới file. Nên test file thật là thứ duy nhất chứng minh việc đọc file
  thật sự chạy được.
- **`priority` ngoài tập giá trị cho phép.** Ca này tách làm hai nửa, và hai nửa cần hai
  cách xử lý khác nhau.

  **Nửa thứ nhất, không cần test.** `Priority` là union type `'low' | 'medium' | 'high'`.
  Viết `createTicket({ priority: 'khẩn-cấp' })` trong code thì TypeScript báo lỗi ngay
  lúc mình đang gõ, chưa chạy dòng nào. Viết test cho ca này là thừa, vì có một tầng khác
  đã chặn rồi, và nó chặn với chi phí runtime bằng không.

  **Nửa thứ hai, bắt buộc phải test.** Người dùng gõ
  `--priority khẩn-cấp` ở terminal thì giá trị đó đi vào qua `process.argv`, và mọi thứ
  từ `argv` đều là **chuỗi**. Lúc đó chương trình đã chạy rồi, TypeScript không còn giúp
  được gì.

  Nếu không kiểm, chuỗi đó được lưu thẳng xuống file. Ticket ấy có `priority` là một giá
  trị không nằm trong ba giá trị cho phép, nên **không lệnh lọc nào tìm ra nó**. Nó nằm
  trong file mà coi như mất.

  Tuần 2 làm đúng vậy: `assertValidPriority` chặn ở `src/commands/create.ts`, kèm test
  `it('priority ngoài tập cho phép thì bị từ chối ngay ở biên CLI')`.

  Điều rút ra: chỗ nào TypeScript phủ được thì đừng viết test, nhưng phải biết TypeScript
  hết phủ ở đâu. Nó hết phủ đúng chỗ dữ liệu từ ngoài đi vào.

## Còn chưa chắc

- Tỷ lệ 50/45/5 mình chọn dựa trên tốc độ, nhưng chưa đo tỉ lệ vỡ unit test. Bảng của
  chính mình ghi unit là tầng dễ vỡ nhất khi refactor. Đó là một chi phí chưa cân được
- Ba dòng unit đầu bảng phụ thuộc vào việc `id`/`createdAt`/tầng lưu có được tiêm hay
  không. Lúc viết thì đó là điều chưa chắc, giờ thì tuần 2 đã tiêm thật nên bảng vẫn đúng
- Ranh giới "ngoài chương trình" xử lý gọn cho `fs`, nhưng chưa chắc còn gọn ở tuần 3
  khi có HTTP client giả và HTTP client thật hoán đổi qua biến môi trường
