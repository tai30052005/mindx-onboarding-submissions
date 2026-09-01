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

> _Cắt phần A (6 giả định về trình độ mình) và phần rủi ro kỹ thuật. Giữ phần B —_
> _bốn giả định sai về bài toán — và hai mục có ảnh hưởng tới bài nộp._
> _Bản đầy đủ ở commit `31c9f97`._

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

🔴 Sai về bản chất bài tập
6. Tôi giả định tuần 1 chấm bạn về TDD.
Tên tuần là "AI Training — Effective Usage & Critical Thinking". Có ai-workflow-log.md (3 workflows + hallucinations caught), có 04-ai-validation.md. ⇒ Bạn được chấm về cách bạn dùng AI và kiểm chứng nó, ngang với nội dung TDD. Câu bạn hỏi tôi ("tôi không có kinh nghiệm để phát hiện bạn sai") chính là đề bài của bạn, không phải một lời than.

---

C-9. Claim nghiên cứu thực nghiệm vẫn CHƯA được kiểm chứng. Tôi dẫn Fucci et al. từ trí nhớ và có dặn bạn tự tra. Nếu nó vào bài nộp mà mentor hỏi, bạn không có gì đỡ. Hoặc tra cho ra, hoặc bỏ hẳn. Đừng để nó ở trạng thái lơ lửng.
🔴 Rủi ro lớn nhất, và nó không phải kỹ thuật
C-12. Phần 3 của tôi mâu thuẫn với chính quy tắc bạn tự đặt ra.
05-common-mistakes.md của bạn ghi:
"Use examples caught in my own refinement session, not a list asked from an AI — a mistake I found and fixed myself is defensible in the interview; a memorised list is not."
"3 điều người mới thường hiểu sai" mà tôi đưa chính xác là một danh sách xin từ AI. Nếu bạn dán nó vào, bạn vi phạm nguyên tắc bạn viết ra để tự bảo vệ mình — trong đúng tuần được chấm về critical thinking. Thêm nữa: brief của bạn đã chỉ đích danh 4 lỗi (over-testing, weak assertions, testing implementation details, blindly trusting AI); 3 mục của tôi không map sạch vào 4 mục đó.
