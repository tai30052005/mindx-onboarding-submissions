# How Testing Controls AI-Generated Implementation

> **Deliverable 4.** This is the file most directly tied to the point of week 1.
> Mọi ví dụ trong file này lấy từ chính tuần làm việc này, ghi lại ở `ai-workflow-log.md`.

## Questions this file answers

- How do tests give control over code an AI wrote? `[đề bài]`
- What changes when the test is written *before* the AI writes the implementation,
  compared to the other way round? `[thêm]`
- What is the problem with letting the AI write both the tests and the code? `[thêm]`
- What do I check before accepting AI-generated code, and in what order? `[thêm]`

## Tests as an executable specification

Đọc code rồi tin vào mắt mình và có một phép kiểm chạy được là hai loại bằng chứng khác
nhau về bản chất, không phải khác nhau về mức độ cẩn thận.

Đọc code cho ra một phán đoán không thể bị bác bỏ bằng máy: mình thấy nó đúng. Một test
cho ra một khẳng định **có thể sai**, và máy sẽ nói cho biết. Đó là khác biệt giữa ý kiến
và bằng chứng.

Khác biệt này lớn hơn hẳn khi code do AI viết, vì một lý do cụ thể: **code AI sinh ra đọc
rất trôi.** Tên biến hợp lý, cấu trúc gọn, comment đầy đủ, không có mùi code ẩu. Nhưng độ
trôi chảy của văn bản và tính đúng đắn của hành vi là hai thứ không liên quan gì đến nhau.
Với code người viết, code lủng củng thường là tín hiệu cảnh báo. Với code AI viết, tín
hiệu đó biến mất — mọi thứ đều trôi chảy như nhau, kể cả phần sai.

Nên khi làm việc với AI, việc đọc code mất phần lớn giá trị chẩn đoán của nó, và test trở
thành thứ gần như duy nhất còn phân biệt được đúng với sai.

Một minh hoạ mình tự chạy trong tuần này: sửa `return { title, status: 'open' }` thành
`return { title: title.trim(), status: 'open' }`. Hành vi đã đổi — ticket lưu xuống giờ
khác trước. Cả 3 test vẫn xanh, vì không test nào khẳng định về khoảng trắng đầu cuối.
Đọc đoạn sửa đó cũng không thấy gì đáng ngờ; nó trông còn *sạch hơn* bản gốc. Bài học rút
ra không phải "test là đủ" mà là: **test chỉ bảo vệ đúng những gì nó khẳng định** — nên
việc quyết định khẳng định cái gì mới là chỗ mình phải giữ quyền.

## Test-first vs code-first when working with AI

| | Test written first | Code generated first |
|---|---|---|
| What anchors the behaviour | Đặc tả của mình, viết ra trước khi AI nhìn thấy bài toán. AI phải đi vừa cái khuôn đó | Bất cứ thứ gì AI sinh ra. Test viết sau chỉ mô tả lại code đã có |
| What can silently go wrong | Đặc tả của mình có thể sai hoặc thiếu — nhưng sai một cách **nhìn thấy được**, vì nó viết ra thành chữ và đọc lại được | Test thừa hưởng đúng điểm mù của code. Assertion bị làm yếu đi cho vừa cái code đang có: gặp `id` sinh ngẫu nhiên bên trong thì assert giá trị chính xác không còn dễ, nên dễ hạ xuống `toBeDefined()` cho xong |
| How a mistake surfaces | Đỏ ngay, tại đúng hành vi sai, trước khi có dòng implementation nào | Không nổi lên. Xanh ngay từ lần chạy đầu, và không phân biệt được "code đúng" với "test không kiểm tra gì" |

Điểm mấu chốt: viết test trước không làm AI viết code giỏi hơn. Nó làm cho **việc AI viết
sai trở nên nhìn thấy được**, và giữ quyền định nghĩa "đúng là gì" ở phía mình.

Đây cũng là chỗ ranh giới "you are the architect" nằm. AI viết implementation thì được.
Nhưng đặc tả — cái gì được coi là đúng — phải do mình cầm bút.

## Why not let the AI write both the tests and the code

Vì cả hai sản phẩm cùng sinh ra từ **một cách hiểu duy nhất**. Nếu cách hiểu đó sai, AI sẽ
viết một implementation sai và một test khẳng định đúng cái sai đó. Chạy lên xanh hết.

Màu xanh khi đó có nghĩa là *"AI nhất quán với chính nó"*, chứ không có nghĩa *"code đúng
với yêu cầu"*. Đây là một vòng lặp tự xác nhận: bên bị kiểm và bên đi kiểm chia sẻ chung
một điểm mù, nên không có phép kiểm nào thật sự diễn ra.

Ví dụ cụ thể cho bài tuần 2: nếu AI hiểu nhầm tập giá trị hợp lệ của `priority`, nó sẽ
viết hàm validate chấp nhận tập sai, **và** viết test khẳng định tập sai đó là đúng. Không
có gì đỏ. Lỗi chỉ lộ ra khi có người đọc lại đề bài — tức là bằng một cơ chế nằm ngoài
test suite.

Không phải vì thế mà AI không bao giờ được viết test. Phân vai đúng là:

- **Đặc tả và các assertion cốt lõi**: của mình. Đây là chỗ định nghĩa "đúng là gì".
- **Test edge case bổ sung, sau khi hành vi đã được neo**: AI viết được, và viết tốt — nó
  nghĩ ra được những ca mình không nghĩ tới. Nhưng đó là mở rộng một đặc tả đã có, không
  phải tạo ra đặc tả.

Nói cách khác: AI được thêm test, không được là nguồn duy nhất quyết định thế nào là đúng.

## My review procedure before accepting AI output

Năm câu hỏi lấy từ `slides-ai-training.md`. Mình dùng chúng theo thứ tự, vì bốn câu đầu
tạo ra **nghi ngờ**, còn câu thứ năm mới tạo ra **bằng chứng** — bỏ câu cuối thì bốn câu
trước chỉ là cảm giác.

**1. Understanding — mình có hiểu nó đang đề xuất gì không?**
Phép thử: gấp màn hình lại, nói lại bằng lời mình. Không nói được thì chưa hiểu, dù đọc
thấy hợp lý.
*Ví dụ trong tuần:* mình nhận đoạn `expect(() => createTicket('')).toThrow('title không
được rỗng')` mà không biết `toThrow` khớp theo substring. Đọc thấy hợp lý, nói lại không
nổi — và đó chính là chỗ về sau lộ ra là một weak assertion.

**2. Alignment — nó có khớp yêu cầu thật không?**
Đối chiếu với **đề bài**, không đối chiếu với AI.
*Ví dụ trong tuần:* AI dựng cả một project chạy được với `npm init`, `jest.config.js`, xử
lý lỗi TypeScript 7. Hữu ích, nhưng lệch phạm vi: mentor đã chốt ngày 17/08 rằng tuần 1
snippet là đủ, project để tuần 2. Chỗ này chỉ phát hiện được bằng cách mở lại
`week-1/overview.md`.

**3. Assumptions — nó đang giả định gì?**
Hỏi thẳng, đừng đoán hộ nó.
*Ví dụ trong tuần:* một câu hỏi duy nhất — *"bạn đang giả định gì về trình độ và về bài
toán của tôi?"* — lôi ra 6 giả định về trình độ và 4 giả định sai về bài toán, trong đó
có cái sai nặng nhất là tưởng tuần 1 chấm về TDD trong khi tuần 1 chấm về cách dùng AI.
Không hỏi thì không cái nào lộ ra.

**4. Risks — có thể hỏng ở đâu, edge case nào bị bỏ?**
*Ví dụ trong tuần:* AI cảnh báo rằng với hàm async, `expect(() => f()).toThrow(...)` sẽ
"im lặng pass mà chẳng kiểm tra gì". Mình cài Jest thật và chạy thử thay vì tin: trên
Jest 30 / Node 24 nó **không** pass, nhưng cũng **không** đỏ một cách bình thường — promise
bị reject không có ai bắt, và worker chết kèm stack trace không chỉ vào test nào. Cùng
hiện tượng với `expect(f()).rejects.toThrow(...)` khi quên `await`: assertion chạy sau khi
test đã kết thúc. Chỉ `await expect(f()).rejects.toThrow(...)` là chạy đúng — pass khi
đúng, và đỏ kèm diff đọc được khi sai. Bài học kép ở đây: rủi ro AI nêu là có thật, nhưng
**mô tả của nó về triệu chứng thì sai**, và chỉ chạy thử mới biết.

**5. Verification — kiểm chứng bằng cách nào?**
Đây là câu duy nhất tạo ra bằng chứng. Ba cách mình dùng, xếp theo độ tin cậy giảm dần:

- **Tự chạy và cố tình phá.** Sửa code cho sai lệch rồi xem test có đỏ không. Phá mà vẫn
  xanh thì test đó vô dụng. Cách này không đòi kinh nghiệm, chỉ đòi chịu thử.
- **Đo thật thay vì tin lập luận.** Trong tuần này mình khẳng định "unit nhanh hơn
  integration một bậc" dựa trên số đo của một thứ khác. Viết một bench nhỏ đo lại: unit
  0.05–0.11ms, integration in-process 1.1–2.5ms. Số đo bác bỏ lập luận, và mình đổi kết
  luận.
- **Hỏi một phiên AI hoàn toàn mới, không phải phiên đã đưa ra phương án.** Phiên cũ đã
  "ký tên" vào đề xuất nên nó phản biện lấy lệ. Phiên mới không biết đây là bài của mình
  nên chê thẳng. Lần áp dụng trong tuần này tìm ra 7 lỗi trong `02-testing-levels.md`,
  trong đó 3 lỗi mình không tự thấy được.

Một quy tắc kèm theo: khi phát hiện AI nói sai, **sửa nó ra mặt** chứ không im lặng tự
chữa. Và nhớ rằng đính chính chỉ có hiệu lực trong đúng cuộc hội thoại đó — phiên mới bắt
đầu lại từ đầu. Thứ nào đáng giữ thì phải đưa vào file quy tắc, theo rule 10 của
`.cursor/rules/overview.mdc`.

## How I verified this

| Claim | How I checked it |
|---|---|
| Test xanh không chứng minh code đúng | Tự sửa `return { title }` thành `return { title: title.trim() }`: hành vi đã đổi mà 3/3 test vẫn xanh |
| Assertion yếu là hệ quả có cấu trúc của việc viết test sau, không phải sơ suất ngẫu nhiên | Quan sát trên demo do AI chạy: với `id`/`createdAt` sinh ngầm bên trong hàm, `toBeDefined()` không bắt được cả `createdAt` sai định dạng lẫn `id` rỗng — và không có assertion nào mạnh hơn viết được nếu không đổi chữ ký hàm |
| Hỏi phiên AI mới cho phản biện thật hơn hỏi lại phiên cũ | Áp dụng trên `02-testing-levels.md`: phiên mới chỉ ra 7 lỗi, trong đó có lỗi dẫn số đo của e2e để chứng minh một claim về integration — lỗi mà hai vòng hỏi ở phiên cũ không nêu |
| Lập luận nghe hợp lý vẫn có thể sai về số | Viết `experiments/speed/bench.test.js` đo unit và integration trong cùng một lần chạy, rồi sửa lại kết luận trong `02` theo số đo |

## Still unsure about

- Ranh giới "AI được thêm test edge case, không được là nguồn đặc tả" nghe rõ trên giấy,
  nhưng chưa rõ trong lúc làm thật thì phân biệt bằng dấu hiệu nào — vì một edge case AI
  đề xuất cũng chính là một khẳng định về hành vi đúng
- Cách "hỏi phiên mới" có chi phí: phải nạp lại bối cảnh, và bối cảnh nạp thiếu thì phản
  biện lệch. Chưa biết ngưỡng nào thì đáng bỏ công đó, ngưỡng nào thì không
- Chưa thử mutation testing bằng công cụ tự động (Stryker), mới làm thủ công hai ba phép
  phá. Chưa biết nó có đáng đưa vào quy trình tuần 2 không hay là quá nặng cho phạm vi này
