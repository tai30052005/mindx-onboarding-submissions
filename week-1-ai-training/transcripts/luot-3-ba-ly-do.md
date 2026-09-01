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
Mất chính xác cái gì: mất những test case mà code hiện tại chưa xử lý.
…
Lý do 2: Test viết sau không có bằng chứng nó biết fail
Mất chính xác cái gì: mất khả năng phân biệt "code đúng" với "test không kiểm tra gì".
…
Lý do 3: Test viết sau chấp nhận thiết kế đang có, kể cả khi thiết kế đó không test được
Mất chính xác cái gì: mất cửa sổ sửa rẻ. Vấn đề vẫn bị phát hiện — nhưng phát hiện lúc sửa đắt gấp nhiều lần.
…

**Hai lý do bị mình loại khỏi `01`:**

Lý do 4: Mất tiêu chí dừng khách quan
Mất chính xác cái gì: mất định nghĩa "xong".
Test viết trước là hợp đồng: xanh hết = xong, dừng. Không có nó, "xong" là một cảm giác, và cảm giác thì trượt về hai phía — hoặc bạn thêm tính năng không ai yêu cầu (tickets archive, ai mà biết), hoặc bạn dừng sớm ở chỗ "chắc ổn rồi".
Lý do 5: Test viết sau thường không bao giờ được viết
Mất chính xác cái gì: mất luôn test. Deadline tới, code chạy rồi, task sau đang chờ. Lý do tầm thường nhất, nhưng nếu hỏi các đội thật thì đây là lý do phổ biến nhất.

---

Câu 3 — Khi nào TDD KHÔNG phù hợp
1. Code khám phá — bạn chưa biết mình muốn gì
TDD đòi bạn viết kỳ vọng trước. Nếu bạn chưa biết kỳ vọng, viết test là bịa.
Tình huống: API lạ, thư viện mới, không rõ response trả về hình dạng gì.
Thay thế: spike có giới hạn thời gian. Đặt hẹn giờ (60–90 phút), viết code nháp bẩn, mục tiêu duy nhất là học, không phải ship. Rồi vứt spike đi và TDD lại từ đầu với hiểu biết vừa có.
🎯 Áp dụng thẳng vào tuần 3 của bạn: đừng TDD phần nối KB API lúc mới bắt đầu. Gọi API thật, xem response thật, lưu response đó thành file fixture, rồi mới TDD với fixture. Viết test dựa trên đoán mò response sẽ ra là bạn đang test trí tưởng tượng của mình.
✅ ĐỒNG THUẬN: spike là kỹ thuật hợp lệ, chính Kent Beck mô tả nó.
⚠️ TRANH CÃI: có thật sự phải vứt spike không, hay dọn dẹp rồi giữ lại. (Vứt là lời khuyên chính thống; giữ là điều đa số thực sự làm.)
2. Cái "đúng" là chuyện thị giác / thẩm mỹ
Không assert được expect(output).toLookGood().
Tình huống trong CLI của bạn: format bảng output tickets list — căn cột, màu, chiều rộng, cách cắt chuỗi dài.
Thay thế: snapshot test để chống hồi quy (bắt được thay đổi ngoài ý muốn, không phán xét được đẹp hay xấu), cộng với xem bằng mắt. Vẫn TDD phần logic đằng sau (lọc gì, sắp xếp thế nào, dữ liệu nào lọt vào) — chỉ miễn TDD cho phần trình bày.
⚠️ TRANH CÃI: mức độ hữu ích của snapshot test. Nhiều người coi chúng là ổ weak assertions vì ai cũng bấm -u cho qua mà không đọc diff.
3. Throwaway / prototype để chốt yêu cầu
Chi phí test không hoàn vốn nếu code sống 2 giờ.
Thay thế: kiểm tra thủ công, giữ input nhỏ và kiểm chứng được bằng mắt. Chuyển sang TDD ngay khi có ai đó nói "cái này dùng luôn được đấy".
⚠️ TRANH CÃI, và tôi nghiêng về phía hoài nghi: rất nhiều "throwaway code" sống mười năm. Cân nhắc kỹ trước khi tự cấp cho mình cái nhãn này.
4. Sửa bug trong code legacy chưa có test
Nghịch lý: TDD thuần bảo viết unit test trước, nhưng code legacy thường không cho phép — mọi thứ dính chặt nhau, không có chỗ chèn.
Thay thế: viết characterization test ở tầng cao nhất mà bạn chạm được (kể cả e2e, kể cả chậm) để khoá hành vi hiện tại — kể cả hành vi sai. Có lưới rồi mới tách dần, tạo "seam", rồi TDD ở tầng đơn vị. Đây là nội dung cuốn Working Effectively with Legacy Code (Michael Feathers).
✅ ĐỒNG THUẬN mạnh — và lưu ý một ngoại lệ quan trọng đi ngược hướng: khi sửa bug, viết test tái hiện bug trước khi sửa là ca TDD ít gây tranh cãi nhất trong toàn ngành. Kể cả người ghét TDD phần lớn vẫn làm cái này. Lý do: bạn có bằng chứng đã tái hiện đúng bug, và có bảo hiểm chống nó quay lại. Nếu interview hỏi "khi nào TDD chắc chắn đáng", đây là câu trả lời an toàn nhất.
5. Vấn đề là hiệu năng, đồng thời, hoặc phân tán
Unit test xanh không nói gì về race condition, deadlock, hay p99 latency. Tệ hơn: chúng tạo cảm giác an toàn giả.
Thay thế: benchmark và load test cho hiệu năng; stress test và fuzz/property-based testing cho đồng thời; deterministic simulation nếu nghiêm túc. Khác loại công cụ, không phải khác liều lượng.
✅ ĐỒNG THUẬN: TDD không phủ được nhóm vấn đề này.

---

**Đề nghị cuối cùng của AI, mình từ chối:**

Demo còn nguyên trong scratchpad (codeFirst.ts / testFirst.ts cùng test của chúng) — cặp đối chiếu này là snippet tốt cho 01, và đúng định dạng "snippet, không project" mà mentor đã chốt.

> _Đã cắt phần cuối. Bản đầy đủ ở commit `31c9f97`._
