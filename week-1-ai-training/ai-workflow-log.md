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
| Layered Questioning | `01-tdd-principles.md`, `02-testing-levels.md` | | |
| Solution Exploration | Decision: how to test the JSON storage layer | | |
| Iterative Refinement | `05-common-mistakes.md` | | |

**Decision I made myself:**

> _Một dòng: chọn gì, vì sao, rủi ro đã biết._

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

### 19/08 — Testing levels

### 20/08 — Solution Exploration: testing the JSON storage layer

> _5 bước: nêu bối cảnh → AI liệt kê vấn đề → khai thác phương án kèm pros/cons →
> **thêm ràng buộc của mình rồi tự chọn** → tổng hợp (chọn gì, vì sao, rủi ro)._

**Options considered**

| Option | Pros | Cons |
|---|---|---|
| Real files in a temp directory | | |
| Mock the `fs` module | | |
| Storage behind an interface + in-memory implementation | | |

**My constraints:** làm một mình · 5 tuần · tuần 3 phải cắm thêm HTTP client

**Chosen:** — **Why:** — **Known risk:**

### 21/08 — Iterative Refinement (test file review)

> _6 bước. Bước 4 là **mình tự sửa**, không nhắn "sửa giúp tôi" — đó là ranh giới
> giữa "you are the architect" và AI làm architect._

**1. AI's output**

**2. Issues I found myself** (before asking anything)

**3. My summary of the problems**

**4. My revised version**

**5. What I fed back**

**6. What the AI added after that**

---

## Part 3 — Hallucinations caught

Labels from `slides-ai-training.md`: `wrong facts/code` · `unnecessary icons/emojis` ·
`invented API` · `outdated information`

| # | Label | What the AI claimed | How I verified it was wrong | How I corrected it explicitly |
|---|---|---|---|---|
| 1 | `wrong facts/code` | Dạy `expect(() => createTicket('')).toThrow('title không được rỗng')` như cách viết đúng | Đọc docs Jest mục `.toThrow(error?)`: nó khớp theo **substring**, nên test vẫn pass với một Error khác miễn message chứa chuỗi đó; và đổi câu chữ message là vỡ test dù hành vi không đổi | Chỉ ra rằng chính nó ở lượt sau đã gọi đây là weak assertion + testing implementation details — hai trong bốn lỗi liệt kê ở `05`. Yêu cầu assert theo loại lỗi thay vì nội dung message |
| 2 | `outdated information` | Khẳng định mục `## Refactor` trong `01-tdd-principles.md` vẫn còn trống | Mở file ra: mục đó đã viết xong và đã lưu trước khi hỏi | Nói rõ là nó đang dựa trên bản đọc cũ, và từ chối để nó viết lại mục đã có |
| 3 | | | | |

> Corrections only hold inside the current conversation — a new session starts clean.
> Anything worth keeping goes into a rules file, per rule 10 of `.cursor/rules/overview.mdc`.
