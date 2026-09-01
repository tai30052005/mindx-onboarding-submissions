# Lượt 3 — ba lý do viết test trước, TDD là thiết kế, khi nào không hợp

> Chép nguyên văn. Tương ứng mục **Lượt 3** trong `../ai-workflow-log.md`.
> Phần đầu là prompt của mình, phần sau là trả lời của AI.
>
> Đối chiếu đáng chú ý: bản này đưa **5 lý do**, `01-tdd-principles.md` chỉ giữ **3**.
> Lý do 4 và 5 bị mình loại — xem cột "Mình sửa lại gì, vì sao" ở Lượt 3 trong log.

---

Tôi là intern, đang nghiên cứu TDD tuần này, tuần sau build một CLI quản lý
ticket bằng TypeScript + Jest theo TDD.
Tôi đã hiểu vòng lặp Red-Green-Refactor, triangulation, và Fake It rồi —
đừng giải thích lại mấy cái đó.
Trả lời ba câu này:
1. Ít nhất 3 lý do cụ thể để viết test TRƯỚC. Với mỗi lý do, nói rõ nếu viết
   test SAU thì mất chính xác cái gì. Tôi cần phần MẤT GÌ, không cần phần
   "lợi ích chung chung".
2. Vì sao TDD được gọi là hoạt động thiết kế chứ không chỉ là hoạt động
   testing? Cụ thể: viết test trước ép tôi phải ra quyết định thiết kế nào
   mà viết code trước thì không?
3. Khi nào TDD KHÔNG phải cách phù hợp? Nêu tình huống cụ thể, và với mỗi
   tình huống thì nên làm gì thay thế.
Tách rõ chỗ nào là đồng thuận trong ngành, chỗ nào là quan điểm còn tranh cãi.
Trả lời bằng tiếng Việt.
Ba câu này đúng là ba chỗ trống trong 01-tdd-principles.md. Trước khi trả lời câu 2, tôi muốn có bằng chứng chạy được thay vì khẳng định suông — dựng lại demo cũ:
Ran 3 commands
Cả ba câu này chính là ba mục trống trong 01-tdd-principles.md. Bằng chứng cho câu 2 tôi vừa chạy thật, số liệu ở dưới.

---

> _Từ đây là trả lời của AI. Đã cắt bớt phần diễn giải dài; giữ lại đúng những chỗ_
> _bảng đối chiếu ở `README.md` có dẫn. Bản đầy đủ nằm trong lịch sử git, commit `31c9f97`._


Câu 1 — Ba lý do viết test TRƯỚC, và mất chính xác cái gì nếu viết SAU
Lý do 1: Test viết sau bị neo vào code đã tồn tại
…
Lý do 2: Test viết sau không có bằng chứng nó biết fail
…
Lý do 3: Test viết sau chấp nhận thiết kế đang có, kể cả khi thiết kế đó không test được
…

**Hai lý do bị mình loại khỏi `01`:**

Lý do 4: Mất tiêu chí dừng khách quan
Lý do 5: Test viết sau thường không bao giờ được viết

---

**Năm tình huống AI đưa ra, `01` giữ ba:**

1. Code khám phá — bạn chưa biết mình muốn gì
2. Cái "đúng" là chuyện thị giác / thẩm mỹ
3. Throwaway / prototype để chốt yêu cầu
4. Sửa bug trong code legacy chưa có test
5. Vấn đề là hiệu năng, đồng thời, hoặc phân tán

Hai cái bị loại là số 2 (thẩm mỹ) và số 3 (throwaway) — yếu nhất trong năm.

---

**Đề nghị cuối cùng của AI, mình từ chối:**

Demo còn nguyên trong scratchpad (codeFirst.ts / testFirst.ts cùng test của chúng) — cặp đối chiếu này là snippet tốt cho 01, và đúng định dạng "snippet, không project" mà mentor đã chốt.

> _Bản đầy đủ ở commit `31c9f97`._
