# Nhật ký làm việc với AI

> **Deliverable 6 / Acceptance criterion 2** — *"Research process with AI is tracked:
> workflows applied and iterations documented."*

---

## Phần 1 — Tổng kết

| Workflow | Dùng cho | Số lượt | Kết quả |
|---|---|---|---|
| Layered Questioning | `01`, `02` | 6 lượt qua 2 phiên | Lượt hỏi giả định lôi ra 4 giả định sai về phạm vi bài. Vòng review đối kháng tìm ra 7 lỗi trong `02`, làm đổi tỷ lệ từ 70/25/5 sang 50/45/5 |
| Solution Exploration | Test tầng lưu trữ JSON bằng cách nào | 1 vòng, 3 phương án | Loại mock `fs` vì nó phá đúng ca "file JSON hỏng". Chọn interface + in-memory, cộng nhóm nhỏ test file thật |
| Iterative Refinement | `05` | 6 bước, 1 vòng | Lần đầu tự tìm được 0/10, ba chỗ sửa cũng do AI viết. Đọc lại cuối tuần tự tìm được 5/6 ở nửa đầu file |

### Quyết định mình tự đưa ra

Giấu tầng lưu trữ sau một interface, kèm một bản in-memory dùng trong test. Cộng thêm một
nhóm nhỏ test dùng file thật cho ba error case bắt buộc.

Lý do 1: nếu tầng lệnh gọi thẳng vào file thì mỗi test lệnh đều phải tạo file thật rồi
xoá đi. Có interface thì test truyền bản in-memory vào, không đụng file nào.

Lý do 2, lý do chính: tuần 3 phải cắm HTTP client vào chính codebase này. Nếu tầng lệnh
gọi thẳng `JsonTicketStore` thì phải sửa mọi chỗ đang gọi nó. Còn nếu nó chỉ biết
interface thì chỉ cần thêm một file mới, `HttpTicketStore`, cũng có `load()` và `save()`.

Rủi ro đã biết: thêm một tầng trừu tượng khi chưa có bằng chứng là cần. Nếu hết tuần 2 mà
interface đó vẫn chỉ có một bản thật thì mình đã trừu tượng hoá sớm.

### Quyết định về phương pháp

Đưa `02` cho một phiên AI **mới** để review, chứ không hỏi lại phiên đã viết ra nó.

Chính phiên đó viết ra `02`. Hỏi nó chỗ nào sai tức là bắt nó chê bài của chính nó, nên
nó sẽ chê nhẹ cho có. Phiên mới không biết bài này của ai nên không có gì phải giữ.

Lần đó tìm ra lỗi nặng nhất của cả tuần: mình dẫn số đo của e2e để chứng minh một khẳng
định về integration.

---

## Bằng chứng để đối chiếu

**1. `experiments/`** — bốn thư mục, chạy bằng `node --test`, không cần cài gì. Người đọc
tự chạy ra kết quả.

**2. `transcripts/`** — chép nguyên văn 5 lượt, đối chiếu được với cột *"Hỏi gì"* và
*"Mình sửa lại gì"* bên dưới. Lượt nào không có transcript thì `transcripts/README.md`
ghi rõ, kèm lý do.

**3. Lịch sử git** — mỗi lần đổi kết luận là một commit riêng nên diff được:

| Đổi cái gì | Trước | Sau | Mở diff bằng |
|---|---|---|---|
| Tỷ lệ 70/25/5 → 50/45/5 sau khi tự đo | `26ec88a` | `d252be6` | `git diff 26ec88a d252be6 -- week-1-ai-training/02-testing-levels.md` |
| Sửa claim async `toThrow` sau khi tự chạy thử | | `e699e47` | `git show e699e47` |
| Viết lại lý do 3 sau khi chạy fake timer | | `2a848a4` | `git show 2a848a4` |
| Đưa `experiments/` vào làm bằng chứng | | `ee20444` | `git show ee20444` |

Diff đầu bảng đáng xem nhất: bản cũ ghi *"Tỷ lệ 70/25/5 là ước lượng theo lập luận, chưa
có số đo thật"*, và ô Speed ghi *"hàng chục đến hàng trăm ms"*. Đúng cái giả định mà phép
đo về sau bác bỏ.

Toàn bộ lịch sử này đã được viết lại một lần, khi mình chuyển commit message sang chuẩn
Conventional Commits theo góp ý của mentor. Nội dung và ngày tháng giữ nguyên, mã commit
thì đổi. Nên nó chứng minh được *thứ tự và nội dung* các lần sửa, chứ không phải là bằng
chứng không can thiệp được.

---

## Phần 2 — Nhật ký từng lượt

### 18/08 — Layered Questioning (TDD)

Công cụ: Claude, phiên riêng có quyền đọc repo này. Trạng thái xuất phát: cả 5 câu trong
`01` đều chưa trả lời được, chưa từng áp dụng TDD vào project nào. Transcript nguyên văn
4 lượt ở `transcripts/`.

| Lượt | Mình hỏi gì | AI đưa ra gì | Mình kiểm bằng cách nào | Mình sửa lại gì |
|---|---|---|---|---|
| **1** | Giải thích R-G-R kèm ví dụ chạy được, và 2-3 hiểu lầm phổ biến | Dựng cả một project chạy được, và vấp lỗi TypeScript 7 chưa được ts-jest hỗ trợ | Tự chạy lại trong `experiments/tdd-loop/`. Rồi phá code: đổi `title` thành `title.trim()`, 3/3 test vẫn xanh dù hành vi đã đổi | Bỏ phần dựng project khỏi `01`. Giữ kết luận từ phép phá code |
| **2** | "Bạn đang giả định gì về trình độ và bài toán của tôi?" | 6 giả định về trình độ, 4 giả định sai về bài toán. Nặng nhất là tưởng tuần 1 chấm về TDD, thực tế chấm về cách dùng AI | Kiểm từng claim. Substring: đọc docs Jest, **đúng**. `toThrow()` async "im lặng pass": tự chạy, **sai** (Phần 3 dòng 4). Nghiên cứu Fucci: không tra được nguồn | Chuyển `03` và `05` sang assert theo loại lỗi. Đưa ràng buộc tiêm `now`/`generateId` vào đầu `03`. Bỏ claim Fucci |
| **3** | Ba câu còn trống của `01` | **5 lý do** thay vì 3, **5 tình huống** TDD không hợp, và đề nghị nhét cặp file `codeFirst.ts` / `testFirst.ts` vào `01` | Kết quả nó chạy trùng với thí nghiệm mình tự chạy ở lượt 1. Hai lần độc lập, cùng một kết luận | Giữ 3 lý do, bỏ lý do 5 vì đó là thói quen làm việc chứ không phải cơ chế của TDD. Giữ 3 tình huống. Chuyển snippet sang `03` |
| **4** | "Lý do nào yếu nhất? Phản biện thế nào trước câu *viết test sau cũng được*?" | Chỉ ra lý do 3 yếu nhất: câu "người viết test sau không còn lựa chọn nào ngoài `toBeDefined()`" là **sai** | Viết `experiments/async-check/faketimer.test.js` với hàm không tiêm gì. Khoá đồng hồ thì assert được giá trị chính xác. **2/2 pass**, người phản biện đúng | Viết lại lý do 3, bỏ câu sai. Đổi "cơ chế duy nhất" thành "rẻ nhất và tự động nhất" |

> Khung ban đầu dựng theo 4 tier (Research → Brief feature → Code example → Validation).
> Thực tế không diễn ra theo 4 tier tách rời: tier 2 và 3 gộp vào lượt 3, tier 4 rải qua
> lượt 2 và lượt 6. Giữ ghi chép theo lượt thật thay vì ép vào khung cũ.

### 20/08 — Testing levels, và một vòng review đối kháng

Transcript lượt 6 ở `transcripts/luot-6-review-doi-khang.md`.

| Lượt | Mình hỏi gì | AI đưa ra gì | Mình kiểm bằng cách nào | Mình sửa lại gì |
|---|---|---|---|---|
| **5** | Dựng bản đầu của `02`. Làm trong phiên Claude Code, không phải một phiên hỏi đáp riêng | Ngầm giả định integration test tốn hàng chục ms vì chạm đĩa, không đo lần nào. Lấy câu chữ acceptance criteria tuần 2 làm định nghĩa cấp test | Đối chiếu định nghĩa với `week-2/overview.md` thay vì lấy từ AI | Chốt một định nghĩa "unit" rồi bảo vệ nó, vì deliverable đòi một bảng so sánh dứt khoát |
| **6** | Đưa `02` cho một phiên AI hoàn toàn mới: tìm chỗ dễ bị phản bác nhất. Kèm câu *"đừng khen phương án này"* | **7 lỗi**, ba trong đó mình không tự thấy (liệt kê ngay dưới bảng) | Tự viết `experiments/speed/bench.test.js`, đo hai nhóm cùng một lượt. Unit ~0.02ms, integration ~0.7ms, chênh khoảng 32 lần. Số đo đứng về phía người review | Đổi tỷ lệ sang **50/45/5**. Chốt một trục duy nhất. Thu hẹp "integration". Bổ sung `tickets update`, ca sinh `id`, ca format output |

Ba lỗi mình không tự thấy ở lượt 6:

- Dùng hai trục định nghĩa mâu thuẫn, không có trọng tài khi chúng cho kết quả khác nhau
- Định nghĩa integration rộng tới mức gộp cả test 0.05ms lẫn test 2ms vào một nhóm, làm
  hỏng mọi lập luận chi phí
- Bảng verify dẫn số đo của khởi động tiến trình để chứng minh một claim về integration,
  tức là chưa từng đo integration lần nào

Lý do chính của mình cho tỷ lệ cũ, integration chậm nên giết vòng lặp TDD, bị chính số đo
của mình bác bỏ.

### 20/08 — Solution Exploration: cách test tầng lưu JSON

> _5 bước: nêu bối cảnh → AI liệt kê vấn đề → khai thác phương án kèm pros/cons →
> thêm ràng buộc của mình rồi tự chọn → tổng hợp._

| Phương án | Được gì | Mất gì |
|---|---|---|
| File thật trong thư mục tạm | Test đúng hành vi thật, gồm cả file hỏng, thiếu file, lỗi encoding. Không phải bảo trì một lớp giả | Chậm hơn: 0.7ms mỗi test so với 0.02ms. Mỗi test phải tự tạo và dọn thư mục tạm, quên là flaky khi Jest chạy song song |
| Mock module `fs` | Nhanh nhất, không chạm đĩa, không cần dọn dẹp | Đang khẳng định về **cái mock**, không phải hành vi thật. Mock `fs` cũng phải cập nhật theo mỗi lần đổi cách gọi API |
| Storage sau một interface, kèm bản in-memory | Phần lớn test chạy ở tốc độ unit. Đổi sang nguồn khác dễ, đúng thứ tuần 3 cần | Thêm một tầng trừu tượng trước khi có bằng chứng là cần. Vẫn phải viết vài test file thật, nên chỉ bổ sung cho phương án 1 |

Ràng buộc của mình: làm một mình · 5 tuần · tuần 3 phải cắm thêm HTTP client.

Chọn phương án 3 làm mặc định, cộng một nhóm nhỏ test theo phương án 1 cho ba error case
bắt buộc. Lý do và rủi ro đã ghi ở Phần 1.

Vì sao loại hẳn phương án 2: mock `fs` nghĩa là thay `fs` thật bằng một cái giả, trả về
bất cứ gì mình bảo. Trong ca "file JSON hỏng", chính mình là người quyết định file hỏng
như thế nào, rồi kiểm xem code có xử lý được đúng kiểu hỏng mình vừa nghĩ ra không. Nó
chỉ chứng minh được đúng thế thôi. File thật ngoài đời hỏng theo những kiểu mình không
nghĩ tới: bị cắt cụt giữa chừng, sai encoding, không có quyền đọc. Mà đây lại là một
trong ba error case đề bài bắt buộc.

### 20/08 — Iterative Refinement (soát lại file test)

> _6 bước. Bước 4 lẽ ra là mình tự sửa, xem ghi chú ở mục 4._

**1. Bản AI đưa ra.** `experiments/refinement/ticket.test.ts`, 6 test. Nhận file với
thông tin duy nhất là "có ít nhất 4 lỗi", không biết lỗi gì và ở đâu.

**2. Những lỗi mình tự tìm được.** **0 trên 10.** Đọc file đó mình thấy bình thường,
không thấy chỗ nào sai. Cả 10 lỗi đều phải được chỉ ra.

Ghi đúng con số này vì nó quyết định mình được phép nhận output của AI tới đâu: mình chỉ
soát được tới mức mình đọc ra. Đọc không ra thì "review kỹ trước khi nhận" chỉ là nói cho
có. Xem thêm mục *Còn chưa chắc* của `04-ai-validation.md`.

Đọc lại chính file đó vào cuối tuần thì tự tìm được 5 trên 6 lỗi ở nửa đầu file. Chi tiết
ở `05-common-mistakes.md`.

**3. Mình tóm tắt lại các vấn đề.** Mười vấn đề, gom thành bốn nhóm khớp với `05`:

- **Weak assertions** — `toBeDefined()`, `toBeTruthy()`, `toThrow('rỗng')` khớp substring
- **Over-testing** — `expect(t.title).toBe('Fix login bug')` đang test phép gán của JavaScript
- **Testing implementation details** — so nguyên chuỗi `JSON.stringify(t)`; test ngầm
  khẳng định `id === 'T-1'` mà không tiêm `generateId`
- **Lỗi chỉ lộ khi chạy thật** — `it` thiếu `async`; `STORE_PATH` cố định nên Jest chạy
  song song sẽ tranh nhau; ghi file xong không dọn

**4. Bản sửa lại.**

> **Ghi chú trung thực:** bước 4 đòi mình tự sửa. Thực tế lần đó AI viết bản sửa, mình
> chỉ đọc lại.

`experiments/refinement/ticket.revised.test.ts`, sửa bốn chỗ trong mười:

- Bỏ `STORE_PATH` cố định, thay bằng `mkdtemp` riêng mỗi test kèm `afterEach` dọn dẹp
- Tách test đầu thành hai test, assert `expect(t.id).toBe('T-1')` thay vì `toBeTruthy()`
- Đổi `toThrow('rỗng')` thành `toThrow(ValidationError)`
- Tách `describe` thành ba khối theo đơn vị

Sáu lỗi còn lại không sửa. Lý do thật là hết giờ, không phải chọn có chủ đích. Chúng được
đánh dấu `TODO`.

Đến tuần 2 thì cả bốn chỗ đã sửa đều thành quyết định thiết kế thật trong
`week-2-3-ticket-cli/`. Một quan sát: `expect(t.id).toBe('T-1')` chỉ viết được **nhờ** đã
tiêm `generateId`. Sửa một assertion yếu kéo theo một thay đổi thiết kế.

**5. Mình phản hồi lại gì.** Đưa bản sửa và hỏi còn sót gì, nói rõ là cố tình để lại 4
`TODO` để phản hồi không bị lãng phí.

**6. Sau đó AI bổ sung được gì.** Ghi vào `05`, mục *Còn chưa chắc*. Chỗ đáng chú ý nhất
là ranh giới giữa over-testing và test phòng hồi quy: `expect(t.title).toBe(...)` hôm nay
là thừa, nhưng khi `title` bắt đầu bị chuẩn hoá thì nó thành test thật.

---

## Phần 3 — Những chỗ AI nói sai đã bắt được

Nhãn lấy từ `slides-ai-training.md`: `wrong facts/code` · `unnecessary icons/emojis` ·
`invented API` · `outdated information`

| # | Nhãn | AI khẳng định gì | Mình kiểm ra sai bằng cách nào | Mình đính chính ra sao |
|---|---|---|---|---|
| 1 | `wrong facts/code` | Dạy `toThrow('title không được rỗng')` như cách viết đúng | Đọc docs Jest mục `.toThrow(error?)`: nó khớp theo **substring**, và đổi câu chữ message là vỡ test dù hành vi không đổi | Yêu cầu assert theo loại lỗi thay vì nội dung message |
| 2 | `outdated information` | Khẳng định mục `## Refactor` trong `01` vẫn còn trống | Mở file ra: mục đó đã viết xong và đã lưu trước khi hỏi | Nói rõ nó đang dựa trên bản đọc cũ, từ chối để nó viết lại mục đã có |
| 3 | `wrong facts/code` | "Unit nhanh hơn integration một bậc độ lớn", kèm số đo làm bằng chứng | Số đo đó là thời gian khởi động tiến trình (e2e), không phải integration. Tự đo lại: integration in-process chưa tới 1ms | Sửa con số trong bảng verify, đổi tỷ lệ từ 70/25/5 sang 50/45/5 vì lập luận cũ dựa trên số sai |
| 4 | `wrong facts/code` | Với hàm async, `expect(() => f()).toThrow(...)` sẽ "im lặng pass mà chẳng kiểm tra gì". Mình tin và chép vào `03` và `04` | Viết `experiments/async-check/async-test.test.js` và chạy. Cái thật sự xanh giả là khi **quên `await`**. Viết đủ `await` thì khẳng định sai bị bắt, test đỏ | Sửa cả `03` lẫn `04`. Rủi ro AI nêu có thật, nhưng mô tả cơ chế thì sai. Phải chạy mới biết |
| 5 | `wrong facts/code` | Trong `01` mình viết: nếu `id`/`createdAt` sinh ngầm thì người viết test sau "không còn lựa chọn nào ngoài `toBeDefined()`" | Viết `experiments/async-check/faketimer.test.js` với hàm không tiêm gì: khoá đồng hồ thì `createdAt` assert được giá trị chính xác, `id` assert bằng regex. **2/2 pass** | Viết lại lý do 3, bỏ câu sai. Ghi rõ đường vòng này yếu hơn tiêm thật |

> Đính chính chỉ có hiệu lực trong đúng cuộc hội thoại đó; phiên mới bắt đầu lại từ đầu.
> Thứ nào đáng giữ thì phải đưa vào file quy tắc, theo rule 10 của `.cursor/rules/overview.mdc`.
