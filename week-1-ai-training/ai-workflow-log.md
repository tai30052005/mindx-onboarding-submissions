# AI Workflow Log

> **Deliverable 6 / Acceptance criterion 2** — *"Research process with AI is tracked:
> workflows applied and iterations documented."*
>
> This is the only criterion that cannot be recovered later. Write each entry
> **during** the session, not afterwards.

---

## Part 1 — Summary

| Workflow | Used for | Iterations | Outcome |
|---|---|---|---|
| Layered Questioning | `01-tdd-principles.md`, `02-testing-levels.md` | 6 lượt qua 2 phiên | Lượt hỏi giả định lôi ra 4 giả định sai về phạm vi bài, trong đó có việc tưởng tuần 1 chấm về TDD. Vòng review đối kháng ở phiên mới tìm ra 7 lỗi trong `02`, làm đổi tỷ lệ đề xuất từ 70/25/5 sang 50/45/5 |
| Solution Exploration | Decision: how to test the JSON storage layer | 1 vòng, 3 phương án | Loại hẳn mock `fs` vì nó phá đúng ca "file JSON hỏng" mà đề bài bắt buộc. Chọn interface + in-memory làm mặc định, cộng nhóm nhỏ test file thật cho ba error case |
| Iterative Refinement | `05-common-mistakes.md` | 6 bước, 1 vòng | Tự tìm được 1/10 lỗi; sửa 3 chỗ phủ ba loại lỗi khác nhau. Phát hiện sửa assertion yếu kéo theo thay đổi thiết kế |

**Decision I made myself:**

> Chọn phương án giấu tầng lưu trữ sau interface với một bản in-memory, cộng một nhóm nhỏ
> test dùng file thật cho ba error case bắt buộc. Vì ràng buộc nặng nhất là tuần 3 phải
> cắm HTTP client vào cùng codebase, và đây là phương án duy nhất chuẩn bị sẵn cho việc
> đó. Rủi ro đã biết: thêm một tầng trừu tượng khi chưa có bằng chứng là cần — nếu cuối
> tuần 2 interface đó vẫn chỉ có một implementation thật thì mình đã trừu tượng hoá sớm.

**Một quyết định khác về phương pháp:** cố tình gửi bài cho một phiên AI **mới** để review
thay vì hỏi lại phiên đã dựng phương án, vì phiên cũ đã "ký tên" vào đề xuất nên chỉ phản
biện lấy lệ. Lần áp dụng đó tìm ra lỗi nặng nhất của cả tuần: mình dẫn số đo của e2e để
chứng minh một khẳng định về integration.

---

## Part 2 — Session log

Template mỗi lượt — copy năm dòng này rồi điền:

- **Hỏi gì:**
- **Assumptions AI đang giả định:**
- **Risks / edge case bị bỏ:**
- **Mình verify bằng cách nào:**
- **Mình sửa lại gì, vì sao:**

### 18/08 — Layered Questioning (TDD)

**Tier 1 — Research**

Công cụ: Claude, phiên riêng có quyền đọc repo này\
Trạng thái xuất phát: cả 5 câu trong phần 01 đều chưa trả lời được.\
Chưa từng áp dụng TDD vào project nào

**Lượt 1 — TDD là gì, Red/Green/Refactor**

- **Hỏi gì:** khai báo thẳng là chưa có kinh nghiệm nên không tự phát hiện được AI
  nói sai; yêu cầu 3 thứ: giải thích R-G-R kèm ví dụ chạy được, tách phần ĐỒNG THUẬN
  khỏi phần QUAN ĐIỂM, và 2-3 hiểu lầm phổ biến.
- **Assumptions AI đang giả định:** _(điền sau khi có Lượt 2)_
- **Risks / edge case bị bỏ:** _(điền sau khi có Lượt 2)_
- **Mình verify bằng cách nào:**
- **Mình sửa lại gì, vì sao:**

**Lượt 2 — bắt AI tự nêu giả định**

- **Hỏi gì:** "bạn đang giả định gì về trình độ và về bài toán của tôi? Có edge case
  hay rủi ro nào chưa nhắc tới không?"
- **Assumptions AI đang giả định:** 6 giả định về trình độ (thạo Node/TS, đọc được
  nguồn tiếng Anh, tự gỡ được toolchain hỏng, cần chiều sâu hơn ngắn gọn). Về bài toán,
  4 giả định sai rõ: (a) tuần 1 cần project chạy được — mentor đã chốt snippet là đủ;
  (b) domain chỉ `createTicket(title, priority)` — thực tế 5 field, 4 lệnh, 3 error case;
  (c) logic thuần không I/O — thực tế tuần 2 có file JSON, tuần 3 có HTTP;
  (d) không có `id` — nhưng `tickets show <id>` bắt buộc phải sinh id.
  Sai nặng nhất: tưởng tuần 1 chấm về TDD, thực tế tuần 1 chấm về cách dùng AI.
- **Risks / edge case bị bỏ:** non-determinism của `id`/`createdAt`; `process.exit()`
  giết Jest worker; test song song tranh nhau file JSON; `toThrow()` không bắt được
  promise reject; quên `await` trong test async gây **xanh giả**; `toThrow('chuỗi')`
  khớp substring nên buộc test vào nội dung message; CRLF/LF trên Windows; `jest --watch`.
- **Mình verify bằng cách nào:**
- **Mình sửa lại gì, vì sao:**

**Lượt 3 — ba chỗ trống còn lại của `01`** (20/08)

- **Hỏi gì:** ba câu, kèm khai báo là đã hiểu R-G-R / triangulation / Fake It rồi nên
  đừng giảng lại: (1) ít nhất 3 lý do viết test **trước**, mỗi lý do phải nói rõ viết
  test **sau** thì mất chính xác cái gì — không nhận "lợi ích chung chung";
  (2) vì sao TDD là hoạt động thiết kế chứ không chỉ testing, cụ thể là ép ra quyết
  định thiết kế nào; (3) khi nào TDD **không** phù hợp, kèm phương án thay thế.
  Vẫn giữ yêu cầu tách đồng thuận khỏi quan điểm tranh cãi.
- **Assumptions AI đang giả định:** giả định trạng thái file `01` vẫn như lần nó đọc
  trước đó — nó kết bài bằng việc nhắc mục Refactor còn trống, trong khi mục đó đã
  viết xong và đã lưu.
- **Risks / edge case bị bỏ:** không có rủi ro kỹ thuật mới; rủi ro nằm ở phía mình —
  nó đưa 5 lý do thay vì 3, và đề nghị nhét cặp file `codeFirst.ts` / `testFirst.ts`
  vào `01`, ngược với quyết định giữ `01` thuần khái niệm.
- **Mình verify bằng cách nào:** kết quả nó chạy (`toBeDefined()` không bắt được
  `createdAt` sai lẫn `id` rỗng) trùng với thí nghiệm mình tự chạy trước đó — đổi
  `title` thành `title.trim()` mà 3/3 test vẫn xanh. Hai lần độc lập cùng một kết luận.
- **Mình sửa lại gì, vì sao:** bỏ lý do 5 ("test viết sau thường không bao giờ được
  viết") vì đó là chuyện thói quen làm việc chứ không phải cơ chế của TDD, bị vặn là
  đuối. Bỏ luôn hai tình huống "thẩm mỹ" và "throwaway" ở câu 3, giữ 3 tình huống
  chắc nhất. Từ chối đưa code vào `01`, chuyển snippet sang `03`.

**Lượt 4 — phản biện**

- **Hỏi gì:** trong 3 lý do vừa nêu, lý do nào yếu nhất và bị phản bác bằng lập luận
  gì; và phản biện ra sao trước câu "viết test sau cũng được, miễn cuối cùng có đủ
  test và đều xanh".
- **Assumptions AI đang giả định:**
- **Risks / edge case bị bỏ:**
- **Mình verify bằng cách nào:**
- **Mình sửa lại gì, vì sao:**

**Tier 2 — Brief feature** (áp vào Ticket Manager CLI)

**Tier 3 — Code example**

**Tier 4 — Validation** (edge cases)

### 20/08 — Testing levels, và một vòng review đối kháng

**Lượt 5 — dựng bản đầu của `02`**

- **Hỏi gì:** làm cùng Claude trong phiên Claude Code, không phải một phiên hỏi đáp riêng.
  Ghi đúng như vậy để không nhận công cho một workflow không xảy ra.
- **Assumptions AI đang giả định:** ngầm giả định integration test tốn hàng chục ms vì
  chạm đĩa — giả định này về sau bị chính phép đo bác bỏ.
- **Risks / edge case bị bỏ:** không đo tốc độ thật; lấy câu chữ trong acceptance criteria
  tuần 2 làm định nghĩa cấp test trong khi nó là phát biểu về phạm vi cần phủ.
- **Mình verify bằng cách nào:** đối chiếu định nghĩa với `week-2/overview.md` thay vì
  lấy từ AI.
- **Mình sửa lại gì, vì sao:** chốt một định nghĩa "unit" và bảo vệ nó, thay vì liệt kê
  tranh cãi rồi né — vì deliverable đòi một bảng so sánh dứt khoát.

**Lượt 6 — review đối kháng ở phiên MỚI**

- **Hỏi gì:** đưa `02` cho một phiên AI hoàn toàn mới đọc và tìm lỗ hổng: chỗ nào trong
  cách phân loại dễ bị phản bác nhất, và người theo Testing Trophy sẽ phản bác lựa chọn
  kim tự tháp bằng lập luận gì. Có thêm câu "đừng khen phương án này".
- **Assumptions AI đang giả định:** phiên mới không biết đây là bài nộp của mình, nên
  không có động cơ giữ thể diện cho phương án — đó chính là lý do chọn nó.
- **Risks / edge case bị bỏ:** review chỉ ra 7 lỗi, trong đó 3 lỗi mình không tự thấy
  được: (a) dùng hai trục định nghĩa mâu thuẫn — trục chủ đề lấy từ acceptance criteria
  và trục biên — mà không có trọng tài khi hai trục cho kết quả khác nhau; (b) định nghĩa
  integration rộng tới mức gộp cả test 0.05ms lẫn test 2ms vào một nhóm, làm hỏng mọi lập
  luận chi phí; (c) bảng verify dẫn số đo của **khởi động tiến trình** để chứng minh một
  claim về **integration** — tức là chưa từng đo integration lần nào.
- **Mình verify bằng cách nào:** không tin lời review, mà tự viết
  `tdd-thu-nghiem/do-toc-do/bench.test.js` — 5 unit test thuần bộ nhớ và 5 integration
  test ghi/đọc file thật trong thư mục tạm, chạy cùng một lần. Kết quả: unit 0.05–0.11ms,
  integration 1.1–2.5ms, cả lần chạy có tiến trình ~88ms. Số đo đứng về phía người review.
- **Mình sửa lại gì, vì sao:** đổi tỷ lệ đề xuất từ 70/25/5 sang **50/45/5**, vì lý do
  chính để loại Trophy — integration chậm nên giết vòng lặp TDD — bị chính số đo của mình
  bác bỏ. Chốt một trục định nghĩa duy nhất (biên ngoài tiến trình) và nói rõ acceptance
  criteria là hệ quả chứ không phải trục thứ hai. Thu hẹp "integration": gọi hàm command
  của chính mình không tính là integration. Viết lại đoạn Trophy thành phản biện đúng
  luận điểm — hai bên dùng chữ "integration" khác nghĩa — thay vì viện dẫn tiêu chí chấm,
  vì viện dẫn rubric là đổi chủ đề chứ không phải bảo vệ lựa chọn. Bổ sung `tickets
  update`, ca sinh `id`, ca format output, tách "nội dung JSON hỏng" khỏi "file trên đĩa
  hỏng", và ghi rõ 13 ca này không phải mẫu theo tỷ lệ.

**Ghi chú về phương pháp:** cố tình gửi sang phiên mới thay vì phiên đã dựng phương án,
để tránh việc AI phản biện chính đề xuất của nó và chỉ đưa ra phản bác lấy lệ. Phiên cũ
đã "ký tên" vào phương án qua hai vòng trước đó.

### 20/08 — Solution Exploration: testing the JSON storage layer

> _5 bước: nêu bối cảnh → AI liệt kê vấn đề → khai thác phương án kèm pros/cons →
> **thêm ràng buộc của mình rồi tự chọn** → tổng hợp (chọn gì, vì sao, rủi ro)._

**Options considered**

| Option | Pros | Cons |
|---|---|---|
| Real files in a temp directory | Test đúng hành vi thật, gồm cả file hỏng, thiếu file, và lỗi encoding — những thứ chỉ xuất hiện khi có `fs` thật. Không phải bảo trì một lớp giả | Chậm hơn: đo thật được 1.1–2.5ms mỗi test so với 0.05–0.11ms của unit. Mỗi test phải tự tạo và dọn thư mục tạm, quên là flaky khi Jest chạy song song |
| Mock the `fs` module | Nhanh nhất, không chạm đĩa, không cần dọn dẹp | Đang khẳng định về **cái mock**, không phải về hành vi thật. Ca "file JSON hỏng" — đúng một trong ba error case bắt buộc — mất hết giá trị, vì chính mình quyết định mock sẽ hỏng thế nào. Mock `fs` cũng phải cập nhật theo mỗi lần đổi cách gọi API |
| Storage behind an interface + in-memory implementation | Phần lớn test chạy ở tốc độ unit. Đổi sang nguồn khác dễ — đúng thứ tuần 3 cần khi cắm HTTP client, và khớp với mô hình mock-first mà `week-3/architecture.md` mô tả | Thêm một tầng trừu tượng trước khi có bằng chứng là cần. Vẫn phải viết vài test file thật cho ba error case bắt buộc, nên không thay thế được phương án 1 mà chỉ bổ sung |

**My constraints:** làm một mình · 5 tuần · tuần 3 phải cắm thêm HTTP client

**Đề xuất từ phân tích trên** — *chờ mình xác nhận trước khi chốt:*

**Chosen:** phương án 3 làm mặc định, cộng một nhóm nhỏ test theo phương án 1 cho ba error
case bắt buộc. **Why:** ràng buộc "tuần 3 cắm HTTP client vào cùng codebase" là ràng buộc
nặng nhất, và phương án 3 là phương án duy nhất chuẩn bị sẵn cho nó; phương án 2 bị loại
hẳn vì nó phá đúng ca "file JSON hỏng" mà đề bài bắt buộc phải test.
**Known risk:** thêm một tầng trừu tượng khi chưa có bằng chứng là cần — đúng thứ DHH gọi
là "test-induced design damage". Nếu tới cuối tuần 2 mà interface đó chỉ có một
implementation thật thì đó là dấu hiệu mình đã trừu tượng hoá quá sớm.

### 20/08 — Iterative Refinement (test file review)

> _6 bước. Bước 4 là **mình tự sửa**, không nhắn "sửa giúp tôi" — đó là ranh giới
> giữa "you are the architect" và AI làm architect._

**1. AI's output**

`tdd-thu-nghiem/refinement/ticket.test.ts` — một file test cho Ticket Manager CLI, 6 test.
Nhận file với thông tin duy nhất là "có ít nhất 4 lỗi", không biết lỗi gì và ở đâu.

**2. Issues I found myself** (before asking anything)

Tự tìm được **1 trên 10**: khối `describe('Ticket', ...)` gom cả `createTicket`,
`updateTicket` (logic thuần trong bộ nhớ) lẫn `JsonTicketStore` với `writeFileSync` (chạm
hệ thống file) vào một chỗ. Theo trục đã chốt ở `02-testing-levels.md` đó là hai tầng khác
nhau, nên tên khối "Ticket" không nói được đơn vị nào đang được test, và không tách được
để chạy riêng nhóm nhanh với nhóm chậm.

Chín lỗi còn lại phải được chỉ ra.

**3. My summary of the problems**

Mười vấn đề, gom thành bốn nhóm khớp với bốn lỗi trong `05`:

- **Weak assertions** — `expect(t).toBeDefined()`, `expect(t.id).toBeTruthy()`,
  `toThrow('rỗng')` khớp substring, `toThrow()` không tham số
- **Over-testing** — `expect(t.title).toBe('Fix login bug')` đang test phép gán của
  JavaScript
- **Testing implementation details** — so nguyên chuỗi `JSON.stringify(t)` nên buộc test
  vào thứ tự khoá; và test ngầm khẳng định `id === 'T-1'` mà không tiêm `generateId`
- **Lỗi chỉ lộ khi chạy thật** — `it` thiếu `async` với `load()` là async; `STORE_PATH`
  cố định dùng chung nên Jest chạy song song sẽ tranh nhau; ghi file xong không dọn; tên
  test `'update giữ nguyên các field khác'` chỉ assert mỗi `status`

**4. My revised version**

`tdd-thu-nghiem/refinement/ticket.revised.test.ts`. Sửa ba chỗ, chọn ba cái phủ đủ ba loại
lỗi khác nhau:

- Bỏ `STORE_PATH` cố định, thay bằng `mkdtemp` riêng cho mỗi test kèm `afterEach` dọn dẹp
- Tách test đầu — một assertion yếu — thành hai test có tên nói rõ hành vi, và assert giá
  trị chính xác `expect(t.id).toBe('T-1')` thay vì `toBeTruthy()`
- Đổi `toThrow('rỗng')` thành `toThrow(ValidationError)`, assert theo loại lỗi thay vì nội
  dung message
- Tách `describe` thành ba khối theo đơn vị: `createTicket`, `JsonTicketStore`,
  `updateTicket`

Bốn test còn lại để nguyên và đánh dấu `TODO` có chủ đích, làm mốc đối chiếu khi quay lại
ở tuần 2.

Một quan sát rút ra ở bước này: `expect(t.id).toBe('T-1')` chỉ viết được **nhờ** đã tiêm
`generateId`. Tức là sửa một assertion yếu kéo theo một thay đổi thiết kế — luận điểm "TDD
là hoạt động thiết kế" ở `01`, lần này gặp theo chiều ngược lại.

**5. What I fed back**

Đưa bản sửa lại và hỏi còn sót gì. Cũng nói rõ là cố tình để lại 4 `TODO` để phản hồi
không bị lãng phí vào những chỗ đã biết.

**6. What the AI added after that**

Ghi vào `05-common-mistakes.md` mục `Still unsure about`. Chỗ đáng chú ý nhất là ranh giới
giữa over-testing và test phòng hồi quy: `expect(t.title).toBe(...)` hôm nay là thừa, nhưng
khi `title` bắt đầu bị chuẩn hoá — cắt khoảng trắng, giới hạn độ dài — thì nó thành test
thật. Chưa có tiêu chí quyết ở thời điểm viết.

---

## Part 3 — Hallucinations caught

Labels from `slides-ai-training.md`: `wrong facts/code` · `unnecessary icons/emojis` ·
`invented API` · `outdated information`

| # | Label | What the AI claimed | How I verified it was wrong | How I corrected it explicitly |
|---|---|---|---|---|
| 1 | `wrong facts/code` | Dạy `expect(() => createTicket('')).toThrow('title không được rỗng')` như cách viết đúng | Đọc docs Jest mục `.toThrow(error?)`: nó khớp theo **substring**, nên test vẫn pass với một Error khác miễn message chứa chuỗi đó; và đổi câu chữ message là vỡ test dù hành vi không đổi | Chỉ ra rằng chính nó ở lượt sau đã gọi đây là weak assertion + testing implementation details — hai trong bốn lỗi liệt kê ở `05`. Yêu cầu assert theo loại lỗi thay vì nội dung message |
| 2 | `outdated information` | Khẳng định mục `## Refactor` trong `01-tdd-principles.md` vẫn còn trống | Mở file ra: mục đó đã viết xong và đã lưu trước khi hỏi | Nói rõ là nó đang dựa trên bản đọc cũ, và từ chối để nó viết lại mục đã có |
| 3 | `wrong facts/code` | Trong bản đầu của `02`, khẳng định "unit nhanh hơn integration một bậc độ lớn" và dẫn số đo làm bằng chứng | Phiên review mới chỉ ra số đo đó là thời gian **khởi động tiến trình** (e2e), không phải integration. Mình tự viết `do-toc-do/bench.test.js` đo lại: integration in-process chỉ 1.1–2.5ms, không phải hàng chục ms | Sửa thẳng con số trong bảng verify, và đổi luôn tỷ lệ đề xuất từ 70/25/5 sang 50/45/5 vì lập luận cũ dựa trên số sai. Ghi rõ trong `02` là tỷ lệ đã đổi và đổi vì lý do gì |
| 4 | `wrong facts/code` | Với hàm async, `expect(() => f()).toThrow(...)` sẽ "im lặng pass mà chẳng kiểm tra gì" — AI nói ở Lượt 2, mình tin và chép lại vào `03` và `04` | Cài Jest 30 thật trong `jest-check/`, viết 4 biến thể và chạy. Nó **không** pass: promise bị reject không ai bắt nên worker chết kèm stack trace không chỉ vào test nào. Cả biến thể `.rejects` thiếu `await` cũng vậy. Chỉ `await expect(f()).rejects.toThrow(...)` mới chạy đúng — pass khi đúng, đỏ có diff khi sai | Sửa cả `03` lẫn `04`, thay câu "im lặng pass" bằng bảng kết quả đo thật kèm phiên bản (Jest 30 / Node 24). Ghi rõ là rủi ro AI nêu **có thật**, nhưng mô tả triệu chứng thì sai — nên vẫn phải chạy mới biết |
| 5 | | | | |

> Corrections only hold inside the current conversation — a new session starts clean.
> Anything worth keeping goes into a rules file, per rule 10 of `.cursor/rules/overview.mdc`.
