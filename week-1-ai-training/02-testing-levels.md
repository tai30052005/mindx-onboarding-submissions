# Ba tầng test: unit, integration, end-to-end

> **Deliverable 2.** Workflow đã dùng: Layered Questioning, rồi một vòng review đối kháng
> ở phiên AI mới. Vòng review đó làm đổi tỷ lệ mình đề xuất — chi tiết ở
> `ai-workflow-log.md`.

## Những câu hỏi file này trả lời

- Unit, integration và end-to-end khác nhau ở đâu? `[đề bài]`
- Mỗi tầng tốn gì, và thật sự bảo vệ được cái gì? `[thêm]`
- Tỷ lệ hợp lý giữa ba tầng là bao nhiêu, và vì sao không viết toàn end-to-end cho chắc? `[thêm]`
- Cho một test cụ thể, nó thuộc tầng nào và vì sao? `[thêm]`

## Định nghĩa mình chọn, và vì sao

Không có định nghĩa "unit" nào được cả ngành đồng thuận — có người hiểu là một hàm, có
người hiểu là một class, có người hiểu là một hành vi. Vì vậy phải chốt một trục duy
nhất rồi bảo vệ nó.

**Trục mình chọn: biên thật nào bị đi qua.**

- **Unit** — không đi qua biên nào. Chạy hoàn toàn trong bộ nhớ: không chạm đĩa, không
  chạm mạng, không đọc đồng hồ hệ thống, không sinh số ngẫu nhiên.
- **Integration** — đi qua ít nhất một biên **ngoài tiến trình**: hệ thống file ở tuần
  2, thêm HTTP ở tuần 3.
- **End-to-end** — chạy chương trình như người dùng chạy: khởi động tiến trình thật từ
  dòng lệnh, kiểm stdout và exit code.

Acceptance criteria tuần 2 phát biểu bằng ngôn ngữ chủ đề — *"Unit tests cover ticket
logic and validation rules"*, *"Integration tests cover JSON file storage and CLI command
behavior"*. Mình coi đó là **hệ quả** của trục biên, không phải một trục thứ hai: logic
ticket và luật validate tình cờ là phần không cần biên nào, còn tầng lưu JSON tình cờ là
phần bắt buộc chạm hệ thống file.

Khi hai cách đọc cho kết quả khác nhau thì **trục biên thắng**. Cụ thể: gọi hàm xử lý
lệnh của chính mình **không** làm cho test thành integration — đó vẫn là code của mình,
không phải một biên. Nếu handler chạy với tầng lưu trong bộ nhớ thì test đó là unit test
của lớp command, dù về chủ đề nó là "CLI command behavior".

Lý do phải nói rõ chỗ này: nếu để "đi qua lớp command" cũng tính là integration, thì
nhóm integration sẽ chứa cả test 0.05ms lẫn test 2ms, và mọi lập luận về chi phí ở dưới
mất nghĩa.

## So sánh ba tầng

| | Unit | Integration | End-to-end |
|---|---|---|---|
| Cái gì đang được test | Một hành vi của logic ticket, luật validate, hoặc lớp command chạy với tầng lưu trong bộ nhớ | Sự phối hợp giữa code của mình và một biên ngoài tiến trình: file JSON trên đĩa | Cả chương trình, khởi động từ dòng lệnh |
| Cái gì bị thay hoặc giả lập | Mọi biên: `fs`, mạng, đồng hồ, bộ sinh `id` | Không giả hệ thống file — dùng thư mục tạm thật. Chỉ giả dịch vụ ngoài không kiểm soát được (KB API tuần 3) | Không giả gì, trừ dịch vụ ngoài |
| Tốc độ (đo thật, xem bảng cuối file) | 0.05 – 0.13 ms | 1.0 – 2.5 ms | ~88 ms cho một lần khởi động tiến trình |
| Có vỡ khi refactor không | Dễ vỡ nhất nếu test bám vào chi tiết nội bộ thay vì hành vi | Vỡ khi đổi định dạng lưu trữ trên đĩa | Ít vỡ nhất khi refactor bên trong; chỉ vỡ khi đổi giao diện CLI |
| Dùng khi nào | Luật nghiệp vụ, validate, lọc, sắp xếp — chỗ nhiều nhánh cần phủ rẻ | Cần bằng chứng round-trip ghi/đọc đúng, và hành vi khi file thật hỏng hoặc thiếu | Cần bằng chứng người dùng gõ lệnh thì ra đúng kết quả |

Cách mình tự nhắc khi phân vân: unit trả lời "logic của mình có đúng không", integration
trả lời "ghi xuống rồi đọc lại có ra đúng thứ đó không", e2e trả lời "gõ lệnh vào thì có
ra kết quả không".

## Chọn tỷ lệ giữa ba tầng

Tỷ lệ mình đề xuất cho CLI này: **khoảng 50% unit, 45% integration, 5% end-to-end.**

Con số này **đã đổi** so với bản đầu. Ban đầu mình viết 70/25/5 với lý do chính là
integration chậm nên sẽ giết vòng lặp TDD. Rồi mình đo thật (bảng verify bên dưới):
integration in-process với thư mục tạm là **1–2.5 ms**, không phải hàng chục ms như mình
ngầm giả định. Ở mức đó, năm trăm integration test vẫn chạy dưới một giây, nên lập luận
tốc độ **không** đứng được với integration. Nó chỉ đứng với e2e, thứ đắt hơn khoảng 40
lần vì phải khởi động tiến trình.

Bỏ lý do tốc độ đi thì vẫn còn ba lý do giữ unit ở tỷ trọng cao:

1. **Đỏ mà biết đỏ ở đâu.** Unit test đỏ thì tên test đã chỉ đúng luật nào hỏng.
   Integration đỏ thì phải phân biệt lỗi ở logic hay ở tầng lưu. Chi phí chẩn đoán, chứ
   không phải chi phí chạy, mới là thứ tích lại theo thời gian.
2. **Bùng nổ tổ hợp.** Các luật validate nhân với bốn lệnh nhân các nhánh hợp lệ / không
   hợp lệ — phủ bằng unit thì mỗi trường hợp vài dòng và không cần dựng trạng thái file.
3. **Integration cần dọn dẹp.** Mỗi test phải tạo và xoá thư mục tạm riêng, nếu không sẽ
   flaky khi Jest chạy song song nhiều worker. Đó là chi phí bảo trì, không hiện ra
   trong con số mili giây.

Còn vì sao **không** viết toàn e2e cho chắc: e2e đắt gấp 40 lần, đỏ mà không chỉ được
nguyên nhân, và dễ flaky vì phụ thuộc thư mục làm việc, biến môi trường, thứ tự chạy.
Nhưng cũng không bỏ hẳn — nó là tầng duy nhất chứng minh các mảnh **lắp lại** thì chạy
được. Unit và integration đều xanh mà `tickets create` vẫn hỏng là chuyện có thật, ví dụ
quên nối lệnh vào entrypoint.

### Phản biện của phe Testing Trophy, và trả lời

Testing Trophy (Kent C. Dodds) đề nghị dồn trọng tâm vào integration thay vì unit, với
lập luận: trong application code, bug sống ở các mối nối chứ không ở logic thuần, nên
test cho nhiều niềm tin nhất trên mỗi đồng bỏ ra là integration.

Ba điểm mình **thừa nhận** họ đúng:

- Lập luận tốc độ của mình sai, và số đo của chính mình chứng minh điều đó. Mình đã đổi
  tỷ lệ vì lý do này chứ không giữ nguyên rồi biện hộ.
- Logic thuần của app này mỏng thật. Validate ticket là vài câu `if`. Rủi ro thật nằm ở
  round-trip serialize, trạng thái file, và map lỗi sang exit code — đúng là các mối nối.
- Trophy có một tầng đáy mà bảng của mình bỏ sót: **static analysis**. Với TypeScript,
  một phần các ca "priority không hợp lệ" chết ngay ở compile time với chi phí runtime
  bằng không; phần còn lại là chuyện thu hẹp kiểu từ chuỗi `argv`, và chuyện đó xảy ra ở
  biên CLI. Type-check nên được tính là một tầng, không phải thứ vô hình.

Chỗ mình **không** nhượng bộ: hai bên đang dùng chữ "integration" với hai nghĩa khác
nhau. Trophy sinh ra từ bối cảnh frontend JavaScript, ở đó "integration" nghĩa là render
một cây component với các con thật — vẫn hoàn toàn trong bộ nhớ, không qua biên nào ngoài
tiến trình. Theo trục của mình, phần lớn "integration test" kiểu Trophy là **unit test**.
So hai tỷ lệ mà không quy về cùng một nghĩa là so sai đơn vị. Sau khi quy đổi, khoảng cách
giữa 50/45/5 của mình và khuyến nghị của Trophy hẹp hơn nhiều so với vẻ ngoài của hai con
số.

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

## Mình kiểm chứng bằng cách nào

| Khẳng định | Kiểm bằng cách nào |
|---|---|
| Định nghĩa unit/integration mình dùng khớp với cách người chấm dùng | Đối chiếu trực tiếp acceptance criteria trong `docs/plans/week-2/overview.md`, không lấy định nghĩa từ AI |
| Bảng phân loại không mâu thuẫn với phần còn lại của bài nộp | Đối chiếu 13 test case này với phạm vi và ba error case bắt buộc liệt kê trong `03-cli-test-plan.md` |
| Unit nhanh hơn integration, nhưng integration vẫn rẻ về tuyệt đối | Tự viết `experiments/speed/bench.test.js`: 5 unit test thuần bộ nhớ và 5 integration test ghi/đọc file thật trong thư mục tạm, chạy cùng một lần. Chạy lại 4 lượt: unit **0.05–0.13 ms**, integration **1.0–2.5 ms**. Test đầu tiên mỗi nhóm bị JIT warm-up nên không tính. Con số dao động theo tải máy, nhưng khoảng cách giữa hai nhóm thì không đổi |
| Lập luận "integration chậm nên giết vòng lặp TDD" là sai | Chính phép đo trên bác bỏ nó: ở 2ms mỗi test thì 500 integration test vẫn dưới 1 giây. Chi phí thật nằm ở e2e (~88ms cho một lần khởi động tiến trình), nên mình đổi tỷ lệ từ 70/25/5 sang 50/45/5 |

## Còn chưa chắc

- Ba dòng unit đầu bảng phụ thuộc vào việc `id`/`createdAt`/tầng lưu có được tiêm hay
  không. Đó là quyết định thiết kế của tuần 2, chưa cam kết — nếu làm khác thì bảng phải
  sửa
- Tỷ lệ 50/45/5 vẫn là ước lượng theo lập luận cộng một phép đo tốc độ, chưa có số đo về
  chi phí **bảo trì**. Bảng của chính mình ghi unit là tầng "dễ vỡ nhất" khi refactor, và
  đó đúng là luận điểm trung tâm của Trophy mà một phép đo tốc độ không trả lời được
- Chưa rõ nên xếp static analysis thành một tầng riêng trong bài nộp hay chỉ nhắc tới.
  Nó không phải test, nhưng nó thật sự chặn được một phần các ca validate với chi phí bằng
  không
- Ranh giới "biên ngoài tiến trình" xử lý gọn cho `fs`, nhưng chưa chắc còn gọn ở tuần 3
  khi có HTTP client giả và HTTP client thật hoán đổi qua biến môi trường
