# Lượt 2 — bắt AI tự nêu giả định

> Chép nguyên văn, tiếp ngay sau Lượt 1 trong cùng phiên.
> Tương ứng mục **Lượt 2** trong `../ai-workflow-log.md`.

---

Trong câu trả lời vừa rồi, bạn đang giả định gì về trình độ và về
bài toán của tôi? Liệt kê ra. Và có edge case hay rủi ro nào bạn
chưa nhắc tới không?
Câu hỏi hay — và một vài giả định của tôi thì kiểm chứng được ngay trong repo này thay vì để tôi đoán tiếp. Để tôi xem.
Ran 4 commands
Tôi đọc scaffold trong repo của bạn rồi. Một số giả định của tôi sai thật, và cái sai đáng kể nhất không nằm ở kỹ thuật.
A. Giả định về trình độ của bạn
#	Tôi đã giả định	Thực tế / rủi ro
1	"Chưa từng viết unit test" ⇒ mới ở mọi mặt, cần giảng từ số 0	Scaffold của bạn có tag provenance [đề bài]/[thêm], bảng How I verified this, mục Still unsure about. Đó là mức tự-phản-tư cao hơn hẳn "intern chưa biết gì". Tôi đã giảng quá kỹ phần dễ và bỏ qua phần khó.
2	Bạn thạo Node/npm/TypeScript, chỉ thiếu mỗi TDD	Tôi dùng interface, union type 'open' | 'done', default parameter, arrow function, tsconfig, npx — không hỏi câu nào. Nếu TS cũng mới, một nửa bài trên là bài TS chứ không phải bài TDD.
3	Bạn đọc được nguồn tiếng Anh	Bạn hỏi bằng tiếng Việt; tôi trả lời tiếng Việt rồi chỉ bạn sang Kent Beck, Fowler, "Is TDD Dead?" — toàn tiếng Anh, không hỏi trước.
4	Bạn tự gỡ được toolchain hỏng	Tôi tình cờ gặp lỗi TS7 và tự thoát. Bạn gặp một mình, giữa tuần, có thể mất nửa ngày.
5	Bạn cần chiều sâu hơn là ngắn gọn	Bạn có thể cần thứ đủ ngắn để làm được ngay. Tôi chọn dài mà không hỏi.
6	Trung thực trí tuệ ("chỗ này còn tranh cãi") luôn có lợi cho bạn	Trong phòng interview, hedging có thể bị đọc là không nắm chắc. Bạn cần một lập trường bảo vệ được, không phải một bản khảo sát. Đây là rủi ro thật, xem mục C-14.
B. Giả định về bài toán — và chỗ repo bác bỏ tôi
🔴 Sai rõ ràng
1. Tôi giả định tuần 1 cần một project chạy được.
week-1-ai-training/README.md ghi quyết định của mentor ngày 17/08: "Snippet là đủ. Tuần 2 e mới làm project nhé."
⇒ Toàn bộ đoạn npm init / lỗi TS7 / setup jest.config.js của tôi không phải deliverable tuần 1. Nó hữu ích như công cụ kiểm chứng cho tôi, và hữu ích cho bạn ở tuần 2 — nhưng nếu bạn bê vào 01-tdd-principles.md là bạn đang đi lệch phạm vi mentor đã chốt.
2. Tôi giả định domain là createTicket(title, priority).
03-cli-test-plan.md cho thấy phạm vi thật: fields title, description, status, priority, tags; 4 lệnh create / list (có filter) / show <id> / update <id>; lưu file JSON local; 3 error case bắt buộc (invalid input, ticket not found, JSON hỏng/thiếu).
⇒ Ví dụ của tôi phủ 2 field, 0 lệnh, 0 error case bắt buộc, 0 storage. Tôi đã demo phần dễ nhất và bỏ trống toàn bộ phần khó.
3. Tôi giả định logic thuần, đồng bộ, không I/O.
Thực tế: tuần 2 có file I/O, và tuần 3 nối KB API trên cùng codebase (README: weeks 2–3 share one codebase). ⇒ async, network, mock, fake — tôi không nói một chữ nào. Xem C-1, C-5, C-6.
4. Tôi giả định không có id.
tickets show <id> bắt buộc phải sinh id. Đây là một trong những chỗ TDD khó nhất với người mới. Tôi không nhắc. Xem C-2.
🟡 Đúng nhưng do may
5. Tôi dùng Jest — trùng với ràng buộc của chương trình, và trùng cảnh báo trong scaffold "đừng trộn với Vitest". Tôi không biết ràng buộc đó khi viết; tôi chỉ suy từ câu hỏi của bạn.
🔴 Sai về bản chất bài tập
6. Tôi giả định tuần 1 chấm bạn về TDD.
Tên tuần là "AI Training — Effective Usage & Critical Thinking". Có ai-workflow-log.md (3 workflows + hallucinations caught), có 04-ai-validation.md. ⇒ Bạn được chấm về cách bạn dùng AI và kiểm chứng nó, ngang với nội dung TDD. Câu bạn hỏi tôi ("tôi không có kinh nghiệm để phát hiện bạn sai") chính là đề bài của bạn, không phải một lời than.
7. Tôi giả định người đọc output là bạn.
Thực tế: mentor pre-check qua Zalo → email thuantv@ cc huynq@ → phỏng vấn miệng. Ba khán giả, ba dạng khác nhau.
8. Tôi giả định câu hỏi bạn gửi là toàn bộ nhu cầu.
01-tdd-principles.md liệt kê 6 câu, tôi bỏ sót 3:
"May tests be modified during the Refactor step?" — tôi không trả lời.
"When is TDD not the right approach?" — tôi chỉ lướt qua.
"Why write the test first — ít nhất 3 lý do; viết test sau thì mất gì?" — tôi đưa ~1.5 lý do.
C. Edge case & rủi ro tôi chưa nhắc
⚠️ Ba cái sẽ cắn bạn chắc chắn ở tuần 2
C-1. Non-determinism: id và createdAt.
crypto.randomUUID() và Date.now() làm test không lặp lại được — bạn không thể expect(t.id).toBe(...). Đây là bức tường đầu tiên. Cách xử lý: tiêm chúng vào (createTicket(input, { now, generateId })) thay vì gọi trực tiếp — hoặc jest.useFakeTimers(). Việc TDD ép bạn phát hiện ra điều này sớm chính là một trong "3 lý do viết test trước" mà tôi thiếu ở mục B-8.
C-2. process.exit() trong test giết luôn Jest worker.
CLI thật gọi process.exit(1) khi lỗi. Nếu bạn test hàm đó in-process, worker chết, output khó hiểu. Tách hàm trả về exit code thay vì tự gọi process.exit; chỉ process.exit(run()) ở entrypoint. Tương tự: process.argv, và capture console.log.
C-3. Test cô lập với file JSON thật.
Jest chạy các file test song song trên nhiều worker mặc định. Nếu hai file test cùng đọc/ghi tickets.json, bạn sẽ có test flaky — lúc xanh lúc đỏ, không do code. Dùng thư mục tạm riêng cho mỗi test (fs.mkdtemp) + dọn dẹp, hoặc jest --runInBand. Người mới thường kết luận nhầm là "TDD không đáng" khi gặp cái này.
⚠️ Bẫy đến trực tiếp từ ví dụ tôi vừa đưa
C-4. toThrow() KHÔNG bắt được promise bị reject.
Tôi dạy bạn expect(() => f()).toThrow(...). Với hàm async (tuần 3, gọi API) cú pháp đó im lặng pass dù chẳng kiểm tra gì. Phải là await expect(f()).rejects.toThrow(...).
C-5. Quên await/return trong test async = XANH GIẢ.
Test kết thúc trước khi assertion chạy → báo pass. Đây là loại lỗi nguy hiểm nhất vì nó vô hình. Cực kỳ liên quan tới tuần 3.
C-6. toThrow('chuỗi') khớp theo substring, và tôi buộc test vào nội dung message tiếng Việt.
Test của tôi sẽ pass với một Error khác miễn message có chứa chuỗi đó. Và đổi câu chữ message = vỡ test dù hành vi không đổi — đúng cái "testing implementation details" trong 05-common-mistakes.md. Nên assert theo loại lỗi / mã lỗi, không theo văn bản.
C-7. Windows. Bạn có .gitattributes — có vẻ đã dính CRLF/LF rồi. Test so sánh output CLI nhiều dòng sẽ vỡ giữa CRLF và LF. Cả đường dẫn \ vs / trong test storage.
C-8. Tôi không nhắc jest --watch. Đây có lẽ là mẹo thực dụng giá trị nhất cho người mới TDD — vòng đỏ/xanh chạy tự động khi lưu file. Thiếu nó, TDD cảm giác chậm chạp và bạn sẽ bỏ.
⚠️ Rủi ro về độ tin cậy của chính câu trả lời trước
C-9. Claim nghiên cứu thực nghiệm vẫn CHƯA được kiểm chứng. Tôi dẫn Fucci et al. từ trí nhớ và có dặn bạn tự tra. Nếu nó vào bài nộp mà mentor hỏi, bạn không có gì đỡ. Hoặc tra cho ra, hoặc bỏ hẳn. Đừng để nó ở trạng thái lơ lửng.
C-10. Phát hiện TS7 có hạn sử dụng. ts-jest có thể hỗ trợ TS7 trước khi bạn tới tuần 2. "Ghim TS 5" có thể thành lời khuyên cũ. Nó đúng hôm nay, trên máy này.
C-11. Tôi bán hơi quá "phá code xem test có đỏ không". Tôi chỉ thử 2 mutation. Nó là heuristic tốt, không phải bằng chứng đầy đủ.
🔴 Rủi ro lớn nhất, và nó không phải kỹ thuật
C-12. Phần 3 của tôi mâu thuẫn với chính quy tắc bạn tự đặt ra.
05-common-mistakes.md của bạn ghi:
"Use examples caught in my own refinement session, not a list asked from an AI — a mistake I found and fixed myself is defensible in the interview; a memorised list is not."
"3 điều người mới thường hiểu sai" mà tôi đưa chính xác là một danh sách xin từ AI. Nếu bạn dán nó vào, bạn vi phạm nguyên tắc bạn viết ra để tự bảo vệ mình — trong đúng tuần được chấm về critical thinking. Thêm nữa: brief của bạn đã chỉ đích danh 4 lỗi (over-testing, weak assertions, testing implementation details, blindly trusting AI); 3 mục của tôi không map sạch vào 4 mục đó.
C-13. Ngược lại, cuộc hội thoại này lại là nguyên liệu tốt cho ai-workflow-log.md — nhưng phải ghi trung thực: vụ TS7 tôi không hề biết trước, tôi phát hiện vì chạy thử. Ghi thành "AI cảnh báo tôi về TS7" là sai sự thật. Ghi thành "AI setup theo mặc định, chạy thì vỡ, phải ghim version" mới đúng — và đúng ra lại là entry mạnh hơn.
C-14. Giọng hedging của tôi vs bảng trong 02-testing-levels.md.
Tôi nói "không có định nghĩa đồng thuận cho unit". Đúng. Nhưng deliverable 2 bắt bạn điền một bảng so sánh rõ ràng và phân loại ~10 test case. Bạn không thể nộp một bảng toàn "còn tranh cãi". Bạn cần chọn một định nghĩa, nói rõ mình chọn nó, và bảo vệ được — biết chỗ tranh cãi là để trả lời khi bị vặn, không phải để né việc chọn.
Tôi đề nghị làm tiếp cái gì
Việc có giá trị nhất bây giờ không phải giảng thêm TDD, mà là lấp 3 chỗ trống thật:
Điền 03-cli-test-plan.md bằng domain thật (4 lệnh, 3 error case, storage JSON) thay vì ví dụ đồ chơi của tôi — kèm C-1/C-2/C-3.
Trả lời 3 câu tôi bỏ sót trong 01 (sửa test lúc Refactor? khi nào TDD không hợp? 3 lý do test-first).
Với 05, không lấy list của tôi — dựng một buổi refinement thật: để tôi viết một file test cố tình có lỗi, bạn tự soi ra, rồi ghi lại cái bạn tìm được.
Muốn bắt đầu từ cái nào?

