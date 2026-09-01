# Nhật ký làm việc với AI

> **Deliverable 6 / Acceptance criterion 2** — *"Research process with AI is tracked:
> workflows applied and iterations documented."*
>
> Đây là tiêu chí duy nhất không dựng lại được về sau. Ghi từng mục
> **ngay trong lúc** làm, không phải ghi sau.

---

## Phần 1 — Tổng kết

| Workflow | Dùng cho | Số lượt | Kết quả |
|---|---|---|---|
| Layered Questioning | `01-tdd-principles.md`, `02-testing-levels.md` | 6 lượt qua 2 phiên | Lượt hỏi giả định lôi ra 4 giả định sai về phạm vi bài, trong đó có việc tưởng tuần 1 chấm về TDD. Vòng review đối kháng ở phiên mới tìm ra 7 lỗi trong `02`, làm đổi tỷ lệ đề xuất từ 70/25/5 sang 50/45/5 |
| Solution Exploration | Quyết định: test tầng lưu trữ JSON bằng cách nào | 1 vòng, 3 phương án | Loại hẳn mock `fs` vì nó phá đúng ca "file JSON hỏng" mà đề bài bắt buộc. Chọn interface + in-memory làm mặc định, cộng nhóm nhỏ test file thật cho ba error case |
| Iterative Refinement | `05-common-mistakes.md` | 6 bước, 1 vòng | Lần đầu tự tìm được 0/10, ba chỗ sửa cũng do AI viết. Đọc lại cuối tuần thì tự tìm được 5/6 ở nửa đầu file. Phát hiện sửa assertion yếu kéo theo thay đổi thiết kế |

**Quyết định mình tự đưa ra:**

> Chọn phương án giấu tầng lưu trữ sau một interface, kèm một bản in-memory dùng trong
> test. Cộng thêm một nhóm nhỏ test dùng file thật cho ba error case bắt buộc.
>
> **Lý do thứ nhất:** nếu tầng lệnh gọi thẳng vào file thì mỗi test lệnh đều phải tạo
> file thật rồi xoá đi. Có interface thì test truyền bản in-memory vào, không đụng file
> nào. Nhanh hơn, và không phải dọn.
>
> **Lý do thứ hai, và là lý do chính:** tuần 3 phải cắm HTTP client vào chính codebase
> này. Nếu tầng lệnh gọi thẳng `JsonTicketStore` thì phải sửa mọi chỗ đang gọi nó. Còn
> nếu nó chỉ biết interface thì chỉ cần thêm một file mới, `HttpTicketStore`, cũng có
> `load()` và `save()`. Tầng lệnh không phải sửa dòng nào.
>
> **Rủi ro đã biết:** thêm một tầng trừu tượng khi chưa có bằng chứng là cần. Nếu hết
> tuần 2 mà interface đó vẫn chỉ có một bản thật thì mình đã trừu tượng hoá sớm.

**Một quyết định khác về phương pháp:** đưa `02` cho một phiên AI **mới** để review, chứ
không hỏi lại phiên đã viết ra nó.

Lý do: chính phiên đó viết ra `02`. Hỏi nó chỗ nào sai tức là bắt nó chê bài của chính
nó, nên nó sẽ chê nhẹ cho có. Phiên mới không biết bài này của ai nên không có gì phải
giữ.

Lần đó tìm ra lỗi nặng nhất của cả tuần: mình dẫn số đo của e2e để chứng minh một khẳng
định về integration.

---

## Bằng chứng cho phần log này

Log là bản thuật lại, viết sau khi việc đã xảy ra. Người đọc chỉ có mỗi lời mình. Ba
nguồn dưới đây để họ tự kiểm chéo.

**1. Thí nghiệm chạy lại được** — `experiments/`, bốn thư mục, chạy bằng `node --test`,
không cần cài gì. Đây là nguồn khó bịa nhất trong ba nguồn, vì người đọc **tự chạy ra
kết quả thật** chứ không phải tin lời mình. Hai nguồn kia thì vẫn phải tin là mình chép
đúng.

**2. Transcript gốc** — `transcripts/`, chép nguyên văn 5 lượt. Đối chiếu được với cột
*"Hỏi gì"* và *"Mình sửa lại gì"* ở từng lượt bên dưới. Lượt nào không có transcript thì
`transcripts/README.md` ghi rõ là không có, kèm lý do.

**3. Lịch sử git** — mỗi lần đổi kết luận là một commit riêng, nên bản trước khi sửa vẫn
còn và diff được:

| Đổi cái gì | Trước | Sau | Mở diff bằng |
|---|---|---|---|
| Tỷ lệ 70/25/5 → 50/45/5 sau khi tự đo | `26ec88a` | `d252be6` | `git diff 26ec88a d252be6 -- week-1-ai-training/02-testing-levels.md` |
| Sửa claim async `toThrow` sau khi tự chạy thử | | `e699e47` | `git show e699e47` |
| Viết lại lý do 3 sau khi chạy fake timer | | `2a848a4` | `git show 2a848a4` |
| Đưa `experiments/` vào làm bằng chứng | | `ee20444` | `git show ee20444` |

Diff đầu bảng là cái đáng xem nhất: bản cũ ghi *"Tỷ lệ 70/25/5 là ước lượng theo lập luận,
chưa có số đo thật"*, và ô Speed ghi *"hàng chục đến hàng trăm ms"*. Đúng cái giả định mà
phép đo về sau bác bỏ.

Một chỗ phải ghi rõ: toàn bộ lịch sử này đã được viết lại một lần, khi mình chuyển các
commit message sang chuẩn Conventional Commits theo góp ý của mentor. Nội dung từng thay
đổi và ngày tháng thì giữ nguyên, nhưng mã commit thì đổi. Nên lịch sử git ở đây chứng
minh được *thứ tự và nội dung* các lần sửa, chứ không phải là bằng chứng không thể can
thiệp.

---

## Phần 2 — Nhật ký từng lượt

### 18/08 — Layered Questioning (TDD)

Công cụ: Claude, phiên riêng có quyền đọc repo này. Trạng thái xuất phát: cả 5 câu trong
`01` đều chưa trả lời được, chưa từng áp dụng TDD vào project nào.

Transcript nguyên văn 4 lượt ở `transcripts/`.

| Lượt | Mình hỏi gì | AI đưa ra gì | Mình kiểm bằng cách nào | Mình sửa lại gì |
|---|---|---|---|---|
| **1** | Giải thích R-G-R kèm ví dụ chạy được; tách phần đồng thuận khỏi phần còn tranh cãi; 2-3 hiểu lầm phổ biến | Dựng cả một project chạy được: `npm init`, `jest.config.js`, và vấp lỗi TypeScript 7 chưa được ts-jest hỗ trợ | Không đọc chay. Dựng lại ví dụ và **tự chạy** trong `experiments/tdd-loop/`: đi đủ 3 vòng, thấy hai kiểu đỏ khác nhau. Rồi cố tình phá code — đổi `title` thành `title.trim()` — **3/3 test vẫn xanh** dù hành vi đã đổi | Bỏ hết phần dựng project khỏi `01`, vì mentor đã chốt 17/08 rằng tuần 1 snippet là đủ. Giữ kết luận từ phép phá code, nó thành nền cho mục Refactor |
| **2** | "Bạn đang giả định gì về trình độ và bài toán của tôi? Có rủi ro nào chưa nhắc không?" | 6 giả định về trình độ, và **4 giả định sai rõ về bài toán** — nặng nhất là tưởng tuần 1 chấm về TDD, thực tế chấm về cách dùng AI. Kèm danh sách rủi ro: `toThrow('chuỗi')` khớp substring, quên `await` gây xanh giả, test song song tranh nhau file | Kiểm từng claim thay vì nhận cả gói. Claim substring — đọc docs Jest, **đúng**. Claim `toThrow()` async "im lặng pass" — tự viết `async-test.test.js` và chạy, **sai** (xem Phần 3 dòng 4). Claim nghiên cứu Fucci — AI tự nhận dẫn từ trí nhớ, mình không tra được nguồn | Chuyển `03` và `05` sang assert theo **loại lỗi** thay vì nội dung message. Đưa ràng buộc tiêm `now`/`generateId` thành quyết định thiết kế ghi rõ ở đầu `03`. Bỏ hẳn claim Fucci khỏi phần chính |
| **3** | Ba câu còn trống của `01`: 3 lý do viết test trước và viết sau thì mất gì; vì sao TDD là thiết kế; khi nào TDD không hợp | **5 lý do** thay vì 3. **5 tình huống** TDD không hợp. Và đề nghị nhét cặp file `codeFirst.ts` / `testFirst.ts` vào `01` | Kết quả nó chạy (`toBeDefined()` không bắt được `createdAt` sai lẫn `id` rỗng) trùng với thí nghiệm mình tự chạy ở lượt 1. Hai lần độc lập, cùng một kết luận | Giữ **3 lý do**, bỏ lý do 5 vì đó là chuyện thói quen làm việc chứ không phải cơ chế của TDD. Giữ **3 tình huống**, bỏ "thẩm mỹ" và "throwaway". Từ chối đưa code vào `01`, chuyển snippet sang `03` |
| **4** | "Trong 3 lý do đó, lý do nào **yếu nhất**? Và phản biện thế nào trước câu *viết test sau cũng được, miễn cuối cùng đủ test và đều xanh*?" | Chỉ ra **lý do 3 yếu nhất**, với một lỗi sự thật kiểm chứng được: câu "người viết test sau không còn lựa chọn nào ngoài `toBeDefined()`" là **sai** | Không tin lời phản bác. Viết `experiments/async-check/faketimer.test.js` với hàm **không tiêm gì**, dùng `randomUUID()` và `new Date()` trực tiếp: khoá đồng hồ lại thì assert được giá trị chính xác, `id` assert bằng regex định dạng. **2/2 pass** — người phản biện đúng | Viết lại toàn bộ lý do 3, bỏ câu sai. Đổi "cơ chế duy nhất" thành "rẻ nhất và tự động nhất". Thêm hẳn một mục cho câu phản bác kia trong `01` |

> **Ghi chú về cấu trúc:** khung ban đầu dựng theo 4 tier (Research → Brief feature →
> Code example → Validation). Thực tế không diễn ra theo 4 tier tách rời. Tier 2 và 3 gộp
> vào lượt 3, tier 4 rải qua lượt 2 và lượt 6. Giữ ghi chép theo lượt thật thay vì ép vào
> khung cũ.


### 20/08 — Testing levels, và một vòng review đối kháng

Transcript lượt 6 ở `transcripts/luot-6-review-doi-khang.md`.

| Lượt | Mình hỏi gì | AI đưa ra gì | Mình kiểm bằng cách nào | Mình sửa lại gì |
|---|---|---|---|---|
| **5** | Dựng bản đầu của `02`. Làm trong phiên Claude Code, **không phải một phiên hỏi đáp riêng** — ghi đúng vậy để không nhận công cho một workflow không xảy ra | Ngầm giả định integration test tốn hàng chục ms vì chạm đĩa. Không đo lần nào. Và lấy câu chữ trong acceptance criteria tuần 2 làm định nghĩa cấp test, trong khi đó là phát biểu về phạm vi cần phủ | Đối chiếu định nghĩa với `week-2/overview.md` thay vì lấy từ AI | Chốt một định nghĩa "unit" rồi bảo vệ nó, thay vì liệt kê tranh cãi rồi né — vì deliverable đòi một bảng so sánh dứt khoát |
| **6** | Đưa `02` cho một phiên AI **hoàn toàn mới**: tìm chỗ dễ bị phản bác nhất trong cách phân loại. Kèm câu *"đừng khen phương án này"* | **7 lỗi**, ba trong đó mình không tự thấy: (a) dùng hai trục định nghĩa mâu thuẫn mà không có trọng tài khi chúng cho kết quả khác nhau; (b) định nghĩa integration rộng tới mức gộp cả test 0.05ms lẫn test 2ms vào một nhóm, làm hỏng mọi lập luận chi phí; (c) **bảng verify dẫn số đo của khởi động tiến trình để chứng minh một claim về integration** — tức là chưa từng đo integration lần nào | Không tin lời review. Tự viết `experiments/speed/bench.test.js`: 5 unit test thuần bộ nhớ và 5 integration test ghi/đọc file thật, chạy cùng một lượt. Kết quả: unit ~0.02ms, integration ~0.7ms, chênh khoảng 32 lần. **Số đo đứng về phía người review** | Đổi tỷ lệ từ 70/25/5 sang **50/45/5**, vì lý do chính của mình — integration chậm nên giết vòng lặp TDD — bị chính số đo của mình bác bỏ. Chốt một trục duy nhất (ra ngoài chương trình hay không), ghi rõ acceptance criteria là hệ quả chứ không phải trục thứ hai. Thu hẹp "integration": gọi hàm command của chính mình không tính. Bổ sung `tickets update`, ca sinh `id`, ca format output, và tách "nội dung JSON hỏng" khỏi "file trên đĩa hỏng" |

> **Ghi chú về phương pháp:** cố tình gửi sang phiên mới thay vì phiên đã dựng phương án,
> để tránh việc AI phản biện chính đề xuất của nó rồi chỉ đưa phản bác lấy lệ. Phiên cũ
> đã "ký tên" vào phương án qua hai vòng trước đó.

### 20/08 — Solution Exploration: cách test tầng lưu JSON

> _5 bước: nêu bối cảnh → AI liệt kê vấn đề → khai thác phương án kèm pros/cons →
> **thêm ràng buộc của mình rồi tự chọn** → tổng hợp (chọn gì, vì sao, rủi ro)._

**Các phương án đã cân**

| Phương án | Được gì | Mất gì |
|---|---|---|
| File thật trong thư mục tạm | Test đúng hành vi thật, gồm cả file hỏng, thiếu file, và lỗi encoding — những thứ chỉ xuất hiện khi có `fs` thật. Không phải bảo trì một lớp giả | Chậm hơn: đo thật được khoảng 0.7ms mỗi test so với 0.02ms của unit — chênh vài chục lần. Mỗi test phải tự tạo và dọn thư mục tạm, quên là flaky khi Jest chạy song song |
| Mock module `fs` | Nhanh nhất, không chạm đĩa, không cần dọn dẹp | Đang khẳng định về **cái mock**, không phải về hành vi thật. Ca "file JSON hỏng" — đúng một trong ba error case bắt buộc — mất hết giá trị, vì chính mình quyết định mock sẽ hỏng thế nào. Mock `fs` cũng phải cập nhật theo mỗi lần đổi cách gọi API |
| Storage sau một interface, kèm bản in-memory | Phần lớn test chạy ở tốc độ unit. Đổi sang nguồn khác dễ — đúng thứ tuần 3 cần khi cắm HTTP client, và khớp với mô hình mock-first mà `week-3/architecture.md` mô tả | Thêm một tầng trừu tượng trước khi có bằng chứng là cần. Vẫn phải viết vài test file thật cho ba error case bắt buộc, nên không thay thế được phương án 1 mà chỉ bổ sung |

**Ràng buộc của mình:** làm một mình · 5 tuần · tuần 3 phải cắm thêm HTTP client


**Chọn:** phương án 3 làm mặc định, cộng một nhóm nhỏ test theo phương án 1 cho ba error
case bắt buộc. **Vì sao:** ràng buộc "tuần 3 cắm HTTP client vào cùng codebase" là ràng buộc
nặng nhất, và phương án 3 là phương án duy nhất chuẩn bị sẵn cho nó; phương án 2 bị loại
hẳn vì nó phá đúng ca "file JSON hỏng" mà đề bài bắt buộc phải test.
**Rủi ro đã biết:** thêm một tầng trừu tượng khi chưa có bằng chứng là cần — đúng thứ DHH gọi
là "test-induced design damage". Nếu tới cuối tuần 2 mà interface đó chỉ có một
implementation thật thì đó là dấu hiệu mình đã trừu tượng hoá quá sớm.

### 20/08 — Iterative Refinement (soát lại file test)

> _6 bước. Bước 4 lẽ ra là **mình tự sửa** — xem ghi chú trung thực ở mục 4 bên dưới._

**1. Bản AI đưa ra**

`experiments/refinement/ticket.test.ts` — một file test cho Ticket Manager CLI, 6 test.
Nhận file với thông tin duy nhất là "có ít nhất 4 lỗi", không biết lỗi gì và ở đâu.

**2. Những lỗi mình tự tìm được** (trước khi hỏi gì)

**0 trên 10.** Đọc file đó mình thấy bình thường, không thấy chỗ nào sai. Cả 10 lỗi đều
phải được chỉ ra.

Ghi đúng con số này vì nó nói được trình độ mình lúc đó. Và vì trần thẩm định là thứ
quyết định mình được phép nhận output AI tới đâu. Tự đánh giá cao hơn thực tế ở chỗ này
là nguy hiểm nhất.

**3. Mình tóm tắt lại các vấn đề**

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

**4. Bản sửa lại**

> **Ghi chú trung thực:** bước 4 của workflow đòi *mình tự sửa*. Thực tế lần đó AI viết
> bản sửa, mình chỉ đọc lại. Ghi đúng như vậy vì phần còn lại của log này chỉ đáng tin
> nếu chỗ nào cũng ghi đúng.

`experiments/refinement/ticket.revised.test.ts`. Sửa bốn chỗ trong mười lỗi:

- Bỏ `STORE_PATH` cố định, thay bằng `mkdtemp` riêng cho mỗi test kèm `afterEach` dọn dẹp
- Tách test đầu, vốn là một assertion yếu, thành hai test có tên nói rõ hành vi, và assert giá
  trị chính xác `expect(t.id).toBe('T-1')` thay vì `toBeTruthy()`
- Đổi `toThrow('rỗng')` thành `toThrow(ValidationError)`, assert theo loại lỗi thay vì nội
  dung message
- Tách `describe` thành ba khối theo đơn vị: `createTicket`, `JsonTicketStore`,
  `updateTicket`

Sáu lỗi còn lại không sửa. Lý do thật là hết giờ, không phải chọn có chủ đích. Chúng được
đánh dấu `TODO` để quay lại ở tuần 2.

Đến tuần 2 thì cả bốn chỗ đã sửa ở đây đều thành quyết định thiết kế thật trong
`week-2-3-ticket-cli/`: thư mục tạm riêng cho mỗi test, assert theo loại lỗi, và tiêm
`generateId` để assert được giá trị chính xác.

Một quan sát rút ra ở bước này: `expect(t.id).toBe('T-1')` chỉ viết được **nhờ** đã tiêm
`generateId`. Tức là sửa một assertion yếu kéo theo một thay đổi thiết kế. Đúng luận điểm "TDD
là hoạt động thiết kế" ở `01`, lần này gặp theo chiều ngược lại.

**5. Mình phản hồi lại gì**

Đưa bản sửa lại và hỏi còn sót gì. Cũng nói rõ là cố tình để lại 4 `TODO` để phản hồi
không bị lãng phí vào những chỗ đã biết.

**6. Sau đó AI bổ sung được gì**

Ghi vào `05-common-mistakes.md` mục `Còn chưa chắc`. Chỗ đáng chú ý nhất là ranh giới
giữa over-testing và test phòng hồi quy: `expect(t.title).toBe(...)` hôm nay là thừa, nhưng
khi `title` bắt đầu bị chuẩn hoá, kiểu cắt khoảng trắng hay giới hạn độ dài, thì nó thành test
thật. Chưa có tiêu chí quyết ở thời điểm viết.

---

## Phần 3 — Những chỗ AI nói sai đã bắt được

Nhãn lấy từ `slides-ai-training.md`: `wrong facts/code` · `unnecessary icons/emojis` ·
`invented API` · `outdated information`

| # | Nhãn | AI khẳng định gì | Mình kiểm ra sai bằng cách nào | Mình đính chính ra sao |
|---|---|---|---|---|
| 1 | `wrong facts/code` | Dạy `expect(() => createTicket('')).toThrow('title không được rỗng')` như cách viết đúng | Đọc docs Jest mục `.toThrow(error?)`: nó khớp theo **substring**, nên test vẫn pass với một Error khác miễn message chứa chuỗi đó; và đổi câu chữ message là vỡ test dù hành vi không đổi | Chỉ ra rằng chính nó ở lượt sau đã gọi đây là weak assertion + testing implementation details — hai trong bốn lỗi liệt kê ở `05`. Yêu cầu assert theo loại lỗi thay vì nội dung message |
| 2 | `outdated information` | Khẳng định mục `## Refactor` trong `01-tdd-principles.md` vẫn còn trống | Mở file ra: mục đó đã viết xong và đã lưu trước khi hỏi | Nói rõ là nó đang dựa trên bản đọc cũ, và từ chối để nó viết lại mục đã có |
| 3 | `wrong facts/code` | Trong bản đầu của `02`, khẳng định "unit nhanh hơn integration một bậc độ lớn" và dẫn số đo làm bằng chứng | Phiên review mới chỉ ra số đo đó là thời gian **khởi động tiến trình** (e2e), không phải integration. Mình tự viết `experiments/speed/bench.test.js` đo lại: integration in-process chưa tới 1ms, không phải hàng chục ms | Sửa thẳng con số trong bảng verify, và đổi luôn tỷ lệ đề xuất từ 70/25/5 sang 50/45/5 vì lập luận cũ dựa trên số sai. Ghi rõ trong `02` là tỷ lệ đã đổi và đổi vì lý do gì |
| 4 | `wrong facts/code` | Với hàm async, `expect(() => f()).toThrow(...)` sẽ "im lặng pass mà chẳng kiểm tra gì" — AI nói ở Lượt 2, mình tin và chép lại vào `03` và `04` | Viết `experiments/async-check/async-test.test.js` và chạy: triệu chứng thật không phải "im lặng pass". Cái thật sự xanh giả là khi **quên `await`** — lúc đó test xanh dù khẳng định bên trong sai hoàn toàn. Viết đủ `await` thì khẳng định sai bị bắt, test đỏ có thông báo đọc được | Sửa cả `03` lẫn `04`. Rủi ro AI nêu **có thật** — test cho hàm async viết sai thì xanh giả — nhưng mô tả cơ chế thì sai. Phải chạy mới biết |
| 5 | `wrong facts/code` | Trong `01`, mình viết: nếu `id`/`createdAt` sinh ngầm trong hàm thì người viết test sau "không còn lựa chọn nào ngoài assert yếu kiểu `toBeDefined()`" | Lượt 4 phản bác bằng một phương án cụ thể. Mình viết `experiments/async-check/faketimer.test.js` với hàm **không tiêm gì**, dùng `randomUUID()` và `new Date()` trực tiếp: khoá đồng hồ lại thì `createdAt` assert được về giá trị chính xác; `id` assert được bằng regex định dạng. **2/2 pass** | Viết lại toàn bộ lý do 3, bỏ câu sai. Ghi rõ đường vòng này yếu hơn tiêm thật: assert định dạng không ghim được giá trị, và khoá đồng hồ là trạng thái toàn cục dễ rò sang test khác |

> Đính chính chỉ có hiệu lực trong đúng cuộc hội thoại đó; phiên mới bắt đầu lại từ đầu.
> Thứ nào đáng giữ thì phải đưa vào file quy tắc, theo rule 10 của `.cursor/rules/overview.mdc`.
