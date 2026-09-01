# Lượt 4 — phản biện: lý do nào yếu nhất

> Chép nguyên văn. Tương ứng mục **Lượt 4** trong `../ai-workflow-log.md`.
> Phần đầu là prompt của mình, phần sau là trả lời của AI.
>
> Đây là lượt dẫn tới việc mình viết `experiments/async-check/faketimer.test.js`
> để tự kiểm lời phản bác, và sau đó viết lại toàn bộ lý do 3 trong `01`.

---

Trong 3 lý do viết test trước mà bạn vừa nêu, lý do nào YẾU nhất? Ai phản bác nó thì phản bác bằng lập luận gì?  Và nếu có người nói với tôi: "viết test sau cũng được, miễn cuối cùng có đủ test và đều xanh" — tôi phản biện lại thế nào cho chắc?
Read TDD principles doc
Ba lý do đó là của `01-tdd-principles.md`, không phải từ lượt trước của tôi — tôi trả lời về ba lý do trong file.
Lý do yếu nhất: Lý do 3
("test viết sau chấp nhận thiết kế đang có, kể cả khi thiết kế đó không test được")
Xếp hạng để thấy rõ: lý do 2 mạnh nhất về logic (nó nói về bằng chứng, thứ không thể có được sau khi đã xanh), lý do 1 mạnh nhất về thực nghiệm. Lý do 3 yếu nhất vì bốn chỗ hở, xếp theo mức nguy hiểm:
a) Tiền đề thực tế của nó sai — và sai theo cách kiểm chứng được. Bài viết: nếu `id`/`createdAt` sinh ngầm trong hàm thì người viết test sau "không còn lựa chọn nào ngoài `toBeDefined()`". Không đúng:

* `createdAt`: `jest.useFakeTimers()` + `setSystemTime()` khoá được đồng hồ mà không đổi chữ ký hàm. Assert bằng giá trị chính xác vẫn làm được.
* `id`: assert đúng cho một id ngẫu nhiên vốn không phải là giá trị cụ thể, mà là "khác rỗng, đúng định dạng, hai lần gọi ra hai giá trị khác nhau" — cả ba đều test được, không cần inject `idGen`.

Nên `toBeDefined()` không phải hậu quả bắt buộc của test-last; nó là hậu quả của việc người viết test bỏ cuộc. Người phản bác chỉ cần đưa 5 dòng fake timer là lý do 3 mất chỗ đứng.
b) Nó không phải luận điểm về thứ tự, mà về quyền sửa code. Người viết test sau — nếu chính là tác giả và được phép refactor — hoàn toàn có thể sửa hàm để tách phụ thuộc ngay lúc đó. Cái ép họ dùng assert yếu là code bị đóng băng, tức là ràng buộc tổ chức (QA viết test cho code người khác, hoặc code đã ship), không phải ràng buộc của test-last. Bạn đang gán cho "thứ tự viết" một chi phí thật ra do "quy trình sở hữu code" gây ra.
c) Nó không độc lập với lý do 1. Kết luận thật của nó là "cửa sổ sửa lúc còn rẻ" — tức là lập luận về vòng lặp ngắn / phản hồi sớm, chứ không phải về test-first. Iterative test-last (viết một hàm, test ngay, rồi mới đi tiếp) cũng có cửa sổ đó. Ba lý do đáng ra phải chặn ba lối thoát khác nhau; lý do 3 trùng lối với lý do 1.
d) Nó là lý do duy nhất DHH bác được trực diện — và bài tự mời DHH vào ngay đoạn dưới. Lập luận đối phương: "thiết kế test được" không đồng nghĩa "thiết kế tốt". Bạn dùng khả-năng-test-được làm thước đo chất lượng thiết kế, rồi kết luận test-first cải thiện thiết kế — vòng tròn định nghĩa. Thêm tham số `clock`/`idGen` vào constructor là làm public API xấu đi để phục vụ test runner, và người dùng thật của API không bao giờ truyền hai tham số đó. Bài đã tự ghi chỗ này vào "Still unsure about", tức là bạn biết nó chưa vững mà vẫn để nó làm một trong ba trụ.
Còn hai chỗ hở nhỏ hơn ở lý do 1 và 2, nói luôn để bạn không bị bất ngờ: lý do 1 chỉ đúng với test-last sau khi viết xong toàn bộ, không đúng với iterative test-last. Lý do 2 dùng chữ "cơ chế duy nhất" — sai. Mutation testing cho đúng bằng chứng đó một cách hệ thống hơn và không cần TDD; đảo assertion / comment thân hàm cũng cho được. Bỏ chữ "duy nhất", đổi thành "cơ chế rẻ nhất và tự động nhất" thì câu đó không bẻ được nữa.
Phản biện "viết test sau cũng được, miễn cuối cùng đủ test và đều xanh"
Đây là lập luận mạnh. Muốn phản biện chắc thì phải nhượng bộ phần đúng trước, nếu không bạn đang bảo vệ một mệnh đề sai và sẽ thua ở chi tiết đó.
Bước 1 — nhượng bộ, có giới hạn. Đúng: test suite cuối cùng không mang dấu vết thứ tự nó được viết. Hai suite giống hệt nhau thì giá trị bằng nhau, bất kể viết trước hay sau. TDD không phải điều kiện cần của test tốt. Nói câu này ra để tranh luận chuyển sang chỗ bạn thắng được.
Bước 2 — chỉ ra hai từ chưa được kiểm chứng trong chính mệnh đề của họ: "đủ" và "xanh".

> _Đã cắt phần cuối. Bản đầy đủ ở commit `31c9f97`._
