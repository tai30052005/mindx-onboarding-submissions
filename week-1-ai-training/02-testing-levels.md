# Testing Levels: Unit vs Integration vs End-to-End

> **Deliverable 2.** Workflow used: Layered Questioning.

## Questions this file answers

- What separates unit, integration, and end-to-end tests? `[đề bài]`
- What does each level cost, and what does each level actually protect? `[thêm]`
- What is a reasonable balance between them, and why not just write end-to-end tests? `[thêm]`
- Given a specific test, which level is it, and why? `[thêm]`

## Định nghĩa mình chọn, và vì sao

Không có định nghĩa "unit" nào được cả ngành đồng thuận — có người hiểu là một hàm, có
người hiểu là một class, có người hiểu là một hành vi. Vì vậy phải chốt một định nghĩa
rồi bảo vệ nó, chứ không né bằng cách nói "còn tranh cãi".

Mình chốt theo đúng ngôn ngữ mà `docs/plans/week-2/overview.md` dùng trong acceptance
criteria: *"Unit tests cover ticket logic and validation rules"* và *"Integration tests
cover JSON file storage and CLI command behavior"*.

Nên trong toàn bộ tài liệu này:

- **Unit** = logic thuần của ticket và các luật validate, chạy hoàn toàn trong bộ nhớ,
  không chạm đĩa, không chạm mạng, không đọc đồng hồ hệ thống.
- **Integration** = có ít nhất một biên thật được đi qua — ghi/đọc file JSON, hoặc đi
  qua lớp xử lý lệnh CLI.
- **End-to-end** = chạy chương trình như người dùng chạy, từ dòng lệnh, kiểm cái in ra
  stdout và exit code.

Chọn định nghĩa này vì nó khớp với tiêu chí sẽ dùng để chấm tuần 2, nên phân loại trong
`03-cli-test-plan.md` không bị lệch với người đọc.

## Comparison

| | Unit | Integration | End-to-end |
|---|---|---|---|
| What is under test | Một hành vi của logic ticket hoặc một luật validate | Sự phối hợp giữa logic và một biên thật: file JSON, lớp command | Cả chương trình, chạy từ dòng lệnh |
| What is replaced / faked | Mọi I/O: `fs`, mạng, đồng hồ, bộ sinh `id` | Chỉ giả dịch vụ ngoài không kiểm soát được (KB API ở tuần 3); file thì dùng thư mục tạm thật | Không giả gì, trừ dịch vụ ngoài |
| Speed | Mili giây — chạy được hàng trăm test trong một lần lưu file | Hàng chục đến hàng trăm mili giây vì chạm đĩa | Giây — phải khởi động tiến trình thật |
| Breaks when refactoring? | Dễ vỡ nhất nếu test bám vào chi tiết nội bộ thay vì hành vi | Vỡ khi đổi định dạng lưu trữ hoặc đổi cấu trúc lệnh | Ít vỡ nhất khi refactor bên trong; chỉ vỡ khi đổi giao diện CLI |
| Use it when | Luật nghiệp vụ, validate, lọc, sắp xếp — chỗ có nhiều nhánh cần phủ rẻ | Cần bằng chứng hai phần ghép lại chạy đúng, nhất là đọc/ghi và xử lý file hỏng | Cần bằng chứng người dùng gõ lệnh thì ra đúng kết quả |

Một cách nhớ gọn: **unit nói code của mình đúng, integration nói các mảnh ghép được với
nhau, end-to-end nói người dùng thật sự dùng được.** Ba câu đó không thay thế được nhau.

## Choosing a balance

Tỷ lệ mình chọn cho CLI này: **nhiều unit, vừa phải integration, rất ít end-to-end** —
đúng hình kim tự tháp. Cụ thể, ước lượng cho tuần 2: khoảng 70% unit cho logic và
validate, 25% integration cho tầng lưu JSON và lớp command, còn lại vài test e2e cho
đường đi hạnh phúc của mỗi lệnh.

Vì sao không viết toàn e2e cho chắc, dù e2e là thứ giống thực tế nhất — bốn lý do, xếp
theo mức độ quan trọng với một người đang làm TDD:

1. **Vòng lặp TDD sẽ chết.** TDD cần vòng đỏ–xanh tính bằng giây. Test e2e tính bằng
   giây cho *một* test; vài chục test e2e là mỗi lần chạy mất vài phút, và khi đó mình
   sẽ ngừng chạy test sau mỗi thay đổi. Test không được chạy thì bằng không có test.
2. **Đỏ mà không biết đỏ ở đâu.** Unit test đỏ thì tên test đã chỉ đúng luật nào hỏng.
   E2e đỏ chỉ nói "lệnh này ra sai", còn nguyên nhân nằm ở validate, ở tầng lưu, hay ở
   chỗ parse tham số thì phải đi debug. Chi phí chẩn đoán lớn hơn chi phí chạy.
3. **Bùng nổ tổ hợp.** Năm luật validate nhân bốn lệnh nhân các nhánh hợp lệ/không hợp
   lệ — phủ bằng unit thì mỗi trường hợp là vài dòng; phủ bằng e2e thì mỗi trường hợp
   là dựng lại toàn bộ trạng thái file rồi chạy tiến trình.
4. **E2e dễ flaky.** Chạm đĩa, chạy tiến trình, phụ thuộc thư mục làm việc và biến môi
   trường. Test lúc xanh lúc đỏ mà không do code thì còn tệ hơn không có test, vì nó
   dạy mình bỏ qua màu đỏ.

Nhưng cũng không bỏ hẳn e2e: nó là tầng duy nhất chứng minh các mảnh **lắp lại** thì
chạy được. Unit và integration đều xanh mà `tickets create` vẫn hỏng là chuyện có thật —
ví dụ quên nối lệnh vào entrypoint. Vài test e2e mỏng là bảo hiểm cho đúng loại lỗi đó.

Cần nói thêm là tỷ lệ này có tranh cãi. Testing Trophy của Kent C. Dodds đề nghị dồn
trọng tâm vào tầng integration thay vì unit, với lập luận rằng integration cho nhiều
niềm tin hơn trên mỗi test. Mình vẫn chọn kim tự tháp cho bài này vì lý do 1 ở trên:
tuần 2 chấm về **quy trình TDD**, mà quy trình đó phụ thuộc vào tốc độ vòng lặp.

## Classifying real examples

Mười test case lấy từ phạm vi thật của Ticket Manager CLI.

| Test case | Level | Why |
|---|---|---|
| `createTicket` với `title` rỗng thì ném lỗi | Unit | Thuần luật validate, không chạm biên nào |
| Ticket mới tạo có `status` mặc định là `open` | Unit | Quy tắc nghiệp vụ trong bộ nhớ |
| `priority` ngoài tập giá trị cho phép thì bị từ chối | Unit | Luật validate, không cần file |
| Lọc một mảng ticket có sẵn theo `status = open` | Unit | Hàm lọc thuần, đầu vào là mảng chứ không phải file |
| Lọc theo nhiều `tags` cùng lúc trả về đúng tập giao | Unit | Vẫn là logic tập hợp trên dữ liệu trong bộ nhớ |
| Ghi một ticket xuống file JSON rồi đọc lại ra đúng ticket đó | Integration | Đi qua biên thật là hệ thống file |
| File `tickets.json` sai cú pháp JSON thì báo lỗi rõ, không crash | Integration | Chỉ tái hiện được khi có file thật hỏng |
| File `tickets.json` không tồn tại thì xử lý theo spec, không văng stack trace | Integration | Trạng thái của biên file, không phải của logic |
| `tickets show <id>` với id không tồn tại thì trả exit code khác 0 kèm thông báo | Integration | Ghép logic tra cứu với lớp command và cơ chế báo lỗi |
| Chạy `tickets create` rồi `tickets list` từ dòng lệnh, kiểm ticket vừa tạo xuất hiện trong stdout | End-to-end | Chạy chương trình thật, kiểm đúng thứ người dùng nhìn thấy |

Hai ghi chú về những chỗ ranh giới mờ, vì đây là chỗ dễ bị vặn:

- Test file JSON hỏng **có thể** viết thành unit nếu giấu tầng lưu trữ sau một interface
  rồi cho implementation trong bộ nhớ ném lỗi. Mình vẫn xếp nó vào integration, vì thứ
  cần bằng chứng ở đây chính là *hành vi khi gặp file thật hỏng* — giả lập nó bằng mock
  là đang test cái mock.
- Test `tickets show <id>` không tìm thấy nằm đúng ranh giới integration/e2e. Mình xếp
  integration vì gọi thẳng hàm xử lý lệnh chứ không spawn tiến trình. Nếu chạy qua binary
  thật thì cùng test case đó thành e2e.

## How I verified this

| Claim | How I checked it |
|---|---|
| Định nghĩa unit/integration mình dùng khớp với cách người chấm dùng | Đối chiếu trực tiếp acceptance criteria trong `docs/plans/week-2/overview.md`, không lấy định nghĩa từ AI |
| Bảng phân loại không mâu thuẫn với phần còn lại của bài nộp | Đối chiếu 10 test case này với phạm vi và ba error case bắt buộc liệt kê trong `03-cli-test-plan.md` |
| Unit test nhanh hơn integration test một bậc độ lớn | Quan sát trên thí nghiệm tự chạy: 3 unit test thuần bộ nhớ chạy dưới 1ms mỗi test, trong khi cả lần chạy có khởi động tiến trình mất khoảng 60–95ms |

## Still unsure about

- Ranh giới integration ↔ e2e cho các test đi qua lớp command: gọi thẳng hàm handler và
  spawn binary thật cho cùng một kết quả, nhưng chi phí và độ giòn khác hẳn nhau
- Tỷ lệ 70/25/5 là ước lượng theo lập luận, chưa có số đo thật; sau tuần 2 mới biết nó
  có đúng với bài này không
- Test file JSON hỏng nên là integration hay nên giấu sau interface để thành unit — mình
  chọn integration nhưng chưa chắc đó là lựa chọn rẻ nhất khi tuần 3 thêm HTTP client
