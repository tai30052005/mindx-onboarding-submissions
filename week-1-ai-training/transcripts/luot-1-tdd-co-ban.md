# Lượt 1 — TDD là gì, Red / Green / Refactor

> Chép nguyên văn phiên AI. Không sửa, không cắt.
> Tương ứng mục **Lượt 1** trong `../ai-workflow-log.md`.
> Phần đầu là prompt của mình, phần sau là trả lời của AI.

---

Tôi là intern, chưa từng dùng TDD, chưa từng viết unit test.
Tuần này tôi phải nghiên cứu TDD và tuần sau build một CLI quản lý ticket
bằng TypeScript + Jest theo TDD.
Vì tôi không có kinh nghiệm để tự phát hiện bạn nói sai, hãy làm 3 việc:
1. Giải thích TDD là gì, và chuyện gì xảy ra trong từng bước
   Red / Green / Refactor. Dùng một ví dụ cụ thể chạy được, không nói chung chung.
2. Nói rõ chỗ nào là ĐỒNG THUẬN trong ngành, chỗ nào là QUAN ĐIỂM
   còn tranh cãi. Tách riêng hai phần đó.
3. Chỉ ra 2-3 điều mà người mới học TDD thường hiểu sai.
Trả lời bằng tiếng Việt.
Tôi sẽ dựng thật ví dụ này và chạy nó, để những gì tôi nói về output không phải là tôi nhớ mà là tôi đã kiểm chứng.

---

> _Đã cắt bớt phần diễn giải dài. Giữ lại hai chỗ bảng đối chiếu ở `README.md` có dẫn:_
> _(a) AI dựng cả project chạy được — mình bỏ hết vì mentor đã chốt snippet là đủ;_
> _(b) danh sách các điểm còn tranh cãi trong ngành. Bản đầy đủ ở commit `31c9f97`._

Ran 2 commands
TypeScript 7 vừa ra và ts-jest chưa hỗ trợ — đây là một cái bẫy thật cho tuần sau của bạn. Ghim về TS 5:
Pin TypeScript 5 and rerun
RED #1 xác nhận. Giờ chạy hết các vòng và ghi lại output thật của từng bước:
Ran 9 commands
Xong. Mọi output dưới đây là output thật tôi vừa chạy, không phải tôi nhớ lại.
Phần 1 — TDD là gì, và chuyện gì xảy ra ở từng bước
Định nghĩa ngắn
TDD (Test-Driven Development) là: bạn viết một test cho một hành vi chưa tồn tại, xem nó fail, viết code tối thiểu để nó pass, rồi dọn dẹp code trong khi test vẫn xanh. Lặp lại — mỗi vòng chỉ vài phút.
Điểm quan trọng nhất, và cũng là điểm hay bị bỏ qua: TDD là một vòng lặp cho từng hành vi một, không phải một pha "viết test" đứng trước một pha "viết code".
Setup (đã kiểm chứng, có một cái bẫy thật)
npm init -y && npm i -D jest ts-jest @types/jest "typescript@^5"
Chú ý typescript@^5. Tôi thử cài typescript không ghim version, npm kéo về TypeScript 7.0.2, và ts-jest 29 từ chối chạy:
The TypeScript compiler "typescript" (version 7.0.2) does not expose the
JavaScript compiler API required by ts-jest.
Tuần sau bạn sẽ đâm đầu vào đúng lỗi này nếu không ghim. jest.config.js:
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = { preset: 'ts-jest', testEnvironment: 'node' };
Vòng 1
🔴 RED — viết test trước, cho code chưa tồn tại
src/ticket.test.ts:

…

Nguyên tắc	Vì sao
Test phải fail trước, và bạn phải tận mắt nhìn thấy nó fail	Không nhìn thấy đỏ thì không có bằng chứng test đang kiểm tra gì. Cái này gần như tiên đề.
Chỉ refactor khi test đang xanh	Refactor trên nền đỏ = bạn không biết cái đỏ mới đến từ đâu.
Không vừa refactor vừa thêm feature	Hai loại thay đổi khác nhau, trộn vào nhau thì không debug được.
"Refactor" = đổi cấu trúc, KHÔNG đổi hành vi quan sát được	Đây là định nghĩa kỹ thuật, không phải cách nói thông tục.
Bước nhỏ, vòng lặp ngắn	Vòng lặp càng ngắn, khoảng cách giữa "gây ra bug" và "biết mình gây bug" càng nhỏ.
Unit test phải nhanh và deterministic	Test chạy 30 giây hoặc thỉnh thoảng đỏ ngẫu nhiên thì bạn sẽ ngừng chạy nó, và nó thành vô dụng.
Coverage cao ≠ code đúng	Xem thí nghiệm A ở trên. Coverage 100% vẫn để lọt.
Test có giá trị như tài liệu sống	Test đọc được cho bạn biết hệ thống phải làm gì.
⚠️ QUAN ĐIỂM còn tranh cãi (người có kinh nghiệm bất đồng thật sự)
1. TDD có thực sự cải thiện chất lượng/năng suất không?
Bằng chứng thực nghiệm hỗn hợp, không dứt khoát. Đáng chú ý, có nghiên cứu so sánh TDD với "iterative test-last" (viết code từng mẩu nhỏ rồi test ngay sau) và không tìm thấy khác biệt có ý nghĩa thống kê — gợi ý rằng lợi ích có thể đến từ bước nhỏ, chứ không phải từ test-first. Tôi khá tự tin về hướng kết luận này nhưng bạn nên tự tra cứu (từ khóa: Fucci et al., TDD external replication) thay vì tin tôi. Ai nói với bạn "nghiên cứu đã chứng minh TDD tốt hơn" là đang nói quá.
2. London school (mockist) vs Detroit/Chicago school (classicist)
London: mock hết dependency, test từng unit cô lập, thiết kế outside-in.
Detroit: dùng object thật, test theo trạng thái, mock chỉ cho I/O thật (network, disk, clock).
Đây là bất đồng thật, kéo dài hàng chục năm, cả hai phe đều có người rất giỏi. Không có phe đúng. Với CLI ticket của bạn, tôi nghiêng về Detroit (mock ít, dùng object thật) — nhưng đó là khuyến nghị, không phải sự thật.
3. "TDD is dead" (2014)
DHH viết bài đó, dẫn tới loạt tranh luận công khai giữa DHH, Martin Fowler và Kent Beck. Đáng xem chính vì nó cho bạn thấy ba người rất giỏi bất đồng một cách văn minh. Kent Beck — người viết cuốn TDD by Example — không hề chủ trương TDD cho mọi tình huống.
4. Test nên bám vào cái gì?
"Test hành vi, đừng test implementation" nghe hay nhưng ranh giới mờ, và mọi người cãi nhau về nó liên tục. Không có quy tắc máy móc.
5. "Unit" là gì?
Một hàm? Một class? Một module? Một hành vi? Không có định nghĩa được đồng thuận. Khi ai đó nói "unit test", hãy hỏi họ đang hiểu unit là gì.
6. Test pyramid vs Testing Trophy
Pyramid: nhiều unit, ít integration, rất ít e2e. Trophy (Kent C. Dodds): dồn trọng tâm vào integration. Tranh luận đang diễn ra.
7. Có bắt buộc test-first 100% thời gian không?
Nhiều người thực hành nghiêm túc vẫn "spike" (viết code nháp thăm dò, vứt đi, rồi mới TDD lại). Có người coi đó là gian lận. Tôi thì không.


> _Đã cắt phần cuối. Bản đầy đủ ở commit `31c9f97`._
