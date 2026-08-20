# TDD Principles and Red-Green-Refactor

> **Deliverable 1.** Workflow used: Layered Questioning.

## Questions this file answers

- What is TDD? `[đề bài]`
- Why is TDD a design practice rather than only a testing practice? `[thêm]`
- What happens in each of Red, Green, and Refactor? `[đề bài]`
- How minimal is "minimal implementation" in the Green step? `[thêm]`
- May tests be modified during the Refactor step? `[thêm]`
- When is TDD *not* the right approach? `[thêm]`

## What TDD is

TDD là Test-Driven Development, là viết một test cho một hành vi chưa tồn tại, xem nó
fail, viết code tối thiểu để pass, rồi dọn dẹp code trong khi test vẫn xanh, và lặp
lại — mỗi vòng vài phút. Điểm hay bị bỏ qua nhất: TDD là vòng lặp cho **từng hành vi
một**, không phải một pha viết hết test rồi mới sang pha viết code.

## Red

Red là bước viết test cho một hành vi chưa tồn tại, chạy nó, và nhìn thấy nó
fail. Có hai kiểu đỏ: đỏ vì code chưa tồn tại — trong TypeScript là lỗi compile,
đây vẫn là RED hợp lệ — và đỏ vì code đã chạy được nhưng chưa đúng hành vi mà
test đòi. Kiểu thứ hai mới là kiểu có giá trị, vì nó cho thấy test đang kiểm tra
đúng hành vi chứ không phải chỉ kiểm tra sự tồn tại của hàm.

Phải thật sự nhìn thấy nó đỏ, chứ không chỉ cần cuối cùng nó xanh. Một test chưa
từng đỏ lần nào thì không phân biệt được với một test luôn xanh bất kể code thế
nào. Trình tự đỏ trước, xanh sau chính là bằng chứng test đang gắn với đúng hành
vi mình định kiểm tra — và đó là thứ bị mất khi viết code trước rồi mới viết test.

## Green

Green là bước viết code tối thiểu để test đang đỏ chuyển sang xanh. "Tối thiểu"
nghĩa là chỉ đủ cho những test hiện có, không viết thêm cho những trường hợp chưa
có test nào phủ.

Hardcode được phép ở bước này — trả thẳng giá trị mà test đang đòi, chưa cần logic.
Kỹ thuật đó gọi là Fake It. Nó hợp lệ vì test tiếp theo sẽ xoá nó đi; còn nếu một
hardcode sống sót qua toàn bộ test suite thì đó là dấu hiệu test còn thiếu, chứ
không phải dấu hiệu hardcode được chấp nhận.

Thứ buộc code tổng quát hoá là test kế tiếp, không phải trực giác của người viết.
Viết implementation hẹp trước rồi để ví dụ thứ hai ép nó rộng ra — kỹ thuật này gọi
là triangulation. Nếu viết sẵn phần tổng quát ngay từ đầu thì test kế tiếp sẽ xanh
ngay lần chạy đầu và chưa từng đỏ, nên không chứng minh được nó có bắt được vấn đề
hay không.

## Refactor

Refactor là đổi cấu trúc code mà không đổi hành vi quan sát được từ bên ngoài,
với test xanh cả trước và sau. Việc được làm ở bước này là đặt lại tên, tách hàm,
gom chỗ trùng lặp, đơn giản hoá — những thay đổi mà nhìn từ phía người gọi thì
không phát hiện ra.

Hai thứ không được làm. Thứ nhất là nhét hành vi mới vào, kiểu thêm một validate
hay xử lý thêm một trường hợp; đó là hành vi mới nên phải quay lại Red. Thứ hai là
bỏ hẳn bước này, xanh xong là nhảy sang test tiếp theo — sau vài chục vòng code
thành đống rối, và Refactor mới chính là chỗ TDD trả lại giá trị.

Test có được sửa ở bước này không: được, nhưng chỉ sửa cấu trúc của test — đổi tên,
tách helper, bỏ trùng lặp. Không được đổi thứ mà test đang khẳng định. Đổi assertion
nghĩa là đổi đặc tả, và việc đó thuộc về Red chứ không phải Refactor. Cũng không sửa
code và sửa test cùng một lúc, vì lúc có test đỏ sẽ không biết đỏ đến từ phía nào.

Một giới hạn cần nhớ: test xanh không đảm bảo refactor đúng. Test chỉ bảo vệ đúng
những gì nó khẳng định, nên nếu thay đổi rơi vào vùng chưa có test nào phủ thì sẽ
không có ai báo.

## Why write the test first

**Lý do 1 — test viết sau bị neo vào code đã tồn tại.** Khi đã đọc implementation
rồi mới viết test, mình đọc các nhánh `if` đang có và viết test phủ đúng chúng. Cái
mất ở đây là những trường hợp code hiện tại chưa xử lý: mình đang test cái code
*làm*, chứ không phải cái nó *phải làm*, và hai thứ đó chỉ khác nhau đúng ở chỗ có
bug.

**Lý do 2 — test viết sau không có bằng chứng rằng nó biết fail.** Test viết sau
chạy lần đầu đã xanh, mà cái xanh đó có hai nguyên nhân khả dĩ: code đúng, hoặc test
không kiểm tra gì cả. Cái mất ở đây là khả năng phân biệt hai nguyên nhân đó. Bắt
buộc thấy đỏ trước là cơ chế **rẻ nhất và tự động nhất** để loại loại test vô dụng
này — không phải cơ chế duy nhất. Mutation testing cho đúng bằng chứng đó một cách hệ
thống hơn, và không cần TDD; nhưng nó là một bước riêng phải nhớ chạy, còn RED thì
nằm sẵn trong vòng lặp.

**Lý do 3 — test viết sau biến câu hỏi về thiết kế thành tuỳ chọn.** Nếu `id` và
`createdAt` được sinh ngầm bên trong hàm, thì viết test trước bắt gặp bức tường
"assert cái này bằng cách nào" khi chưa có dòng code nào và sửa gần như miễn phí. Viết
test sau thì câu hỏi đó không bắt buộc phải trả lời — code đã chạy rồi, và luôn có
đường vòng.

Đây là lý do yếu nhất trong ba lý do, và cần nói rõ nó yếu ở đâu:

- **Đường vòng thật sự tồn tại, và nó dùng được.** Mình đã chạy thử: `jest.useFakeTimers()`
  cộng `setSystemTime()` khoá được `createdAt` về giá trị chính xác mà **không** đổi chữ
  ký hàm; còn `id` ngẫu nhiên assert được bằng định dạng và bằng tính duy nhất giữa hai
  lần gọi. Cả ba test đều pass. Nên `toBeDefined()` **không** phải hậu quả bắt buộc của
  test-last — nó là hậu quả của việc người viết test bỏ cuộc.
- **Đây là luận điểm về quyền sửa code, không phải về thứ tự.** Người viết test sau, nếu
  là tác giả và được phép refactor, hoàn toàn có thể tách phụ thuộc ngay lúc đó. Thứ ép
  họ dùng assert yếu là code bị đóng băng — ràng buộc tổ chức, không phải ràng buộc của
  test-last.

Cái thật sự còn lại của lý do 3, sau khi trừ đi hai chỗ trên: test-first làm câu hỏi
thiết kế thành **không thể né**, còn test-last làm nó thành **có thể né** — và đường vòng
tuy dùng được thì vẫn yếu hơn. Assert theo định dạng không ghim được giá trị; fake timer
là trạng thái toàn cục, quên `useRealTimers()` là rò sang test khác.

Ngoài ba lý do trên còn một lý do nữa: test viết trước là tiêu chí dừng khách quan.
Xanh hết nghĩa là xong. Không có nó thì "xong" chỉ là một cảm giác, và cảm giác thì
trượt về cả hai phía — hoặc làm thừa, hoặc dừng sớm.

Đây cũng là lý do TDD được gọi là hoạt động thiết kế chứ không chỉ là hoạt động
testing. Test là khách hàng đầu tiên của code, nên viết test trước buộc mình chốt
public API, chốt nguồn của những giá trị không xác định như thời gian và id, và chốt
hình dạng của lỗi — tất cả trước khi có dòng implementation nào. Cách nói chính xác
nhất là: **TDD không đảm bảo thiết kế tốt, nó làm cho thiết kế xấu đau sớm, lúc sửa
còn rẻ.**

Điểm này có tranh cãi thật. DHH gọi việc bẻ code cho test được là "test-induced
design damage" — thêm tầng gián tiếp để phục vụ test chứ không phục vụ bài toán. Với
bài toán của mình, một CLI nhỏ do một người làm trong năm tuần và tuần 3 phải cắm
thêm HTTP client vào cùng codebase, mình nghiêng về phía làm rõ phụ thuộc: chi phí
đổi chữ ký hàm ở tuần 3 lớn hơn chi phí thêm tham số ở tuần 2.

Nhưng phải thừa nhận chỗ lập luận này hở: nếu lấy **khả năng test được** làm thước đo
chất lượng thiết kế, rồi kết luận test-first cải thiện thiết kế, thì đó là vòng tròn định
nghĩa. Người dùng thật của `createTicket` không bao giờ truyền `clock` và `idGen`. Mình
chọn tiêm vì một lý do cụ thể của bài này — tuần 3 phải hoán đổi implementation — chứ
không vì "test được thì đẹp hơn".

### "Viết test sau cũng được, miễn cuối cùng có đủ test và đều xanh"

Đây là phản bác mạnh nhất, và nó **đúng một phần**: test suite cuối cùng không mang dấu
vết thứ tự nó được viết. Hai suite giống hệt nhau thì giá trị bằng nhau. TDD không phải
điều kiện cần của test tốt.

Chỗ mệnh đề đó chưa được kiểm chứng nằm ở hai chữ **"đủ"** và **"xanh"**.

**"Xanh"** không phải thuộc tính của test, nó là kết quả của một lần chạy. Một test chưa
từng đỏ thì màu xanh không mang thông tin. Hai suite trông giống nhau, nhưng một suite đã
có bằng chứng từng bắt được lỗi, suite kia thì chưa.

**"Đủ"** đo bằng gì? Test-last hầu như luôn đo bằng coverage. Mà coverage đếm **dòng code
đã tồn tại** được chạy — nên về mặt cấu trúc nó không thể phát hiện hành vi bị thiếu hoàn
toàn: không có code thì không có dòng nào để miss. Ví dụ ngay trong bài này: với
`if (title === '')`, coverage đạt 100% mà ca `'   '` vẫn lọt, vì không có nhánh nào cho nó.

Cách biến tranh cãi này thành thứ đo được: **chạy mutation testing lên cả hai suite rồi so
mutation score.** Test-last điển hình tụt điểm ở ba chỗ — weak assertions, error path, và
biên. Cách này sai được hai chiều: nếu suite test-last đạt điểm cao thì họ đúng.

Và trong bối cảnh tuần 1 — code do AI sinh — lập luận đổi hẳn cường độ. Để AI viết
implementation rồi bảo AI viết test cho chính implementation đó, thì AI đọc code và sinh
test khớp với code, kể cả khi code sai. Điều kiện *"cuối cùng có đủ test và đều xanh"*
được thoả mãn hoàn hảo trong khi kết quả vẫn sai hoàn toàn. Với code AI sinh, test viết
trước là đặc tả độc lập để chấm output; test viết sau chỉ là bản chép lại hành vi hiện có
dưới dạng assertion.

## When TDD does not fit

**Code khám phá, khi chưa biết mình muốn gì.** TDD đòi viết kỳ vọng trước; chưa biết
kỳ vọng thì viết test là bịa. Thay thế: spike có giới hạn thời gian — viết code nháp
với mục tiêu duy nhất là học, rồi vứt đi và TDD lại từ đầu. Áp thẳng vào tuần 3: gọi
KB API thật, xem response thật, lưu thành fixture, rồi mới TDD với fixture đó.

**Sửa code legacy chưa có test.** Mọi thứ dính chặt nhau nên không có chỗ chèn unit
test. Thay thế: viết characterization test ở tầng cao nhất mình chạm được để khoá
hành vi hiện tại — kể cả hành vi sai — rồi mới tách dần và TDD ở tầng đơn vị.

**Vấn đề về hiệu năng, đồng thời, phân tán.** Unit test xanh không nói gì về race
condition hay p99 latency, và tệ hơn là nó tạo cảm giác an toàn giả. Thay thế:
benchmark và load test cho hiệu năng, stress test và fuzz cho đồng thời. Đây là khác
loại công cụ, không phải khác liều lượng.

Ngược lại, ca TDD ít gây tranh cãi nhất toàn ngành là sửa bug: viết test tái hiện bug
trước khi sửa. Kể cả người phản đối TDD phần lớn vẫn làm việc này, vì nó vừa chứng
minh đã tái hiện đúng bug, vừa là bảo hiểm chống bug quay lại.

## How I verified this

| Claim | How I checked it |
|---|---|
| Test xanh không có nghĩa là code đúng | Đổi `return { title }` thành `return { title: title.trim() }` — hành vi đã khác mà 3/3 test vẫn xanh |
| Test thứ hai là thứ buộc code tổng quát hoá | Với `if (title === '')`, thêm test truyền `'   '` thì đỏ; sửa thành `title.trim() === ''` mới xanh |
| `toThrow('chuỗi')` khớp theo substring | Đọc docs Jest chính thức, mục `.toThrow(error?)` |

## Still unsure about

- Ranh giới giữa "làm rõ phụ thuộc" và "ceremony thừa" khi tiêm `clock` / `idGen` vào —
  hai phe Beck và DHH nhìn cùng một đoạn code ra hai kết luận ngược nhau
- Snapshot test có đáng dùng cho phần format output của `tickets list` không, hay nó
  chỉ là một ổ weak assertions khác
- Claim về nghiên cứu thực nghiệm so sánh TDD với iterative test-last (Fucci et al.) —
  AI dẫn từ trí nhớ, mình chưa tra được nguồn nên không đưa vào phần chính
