# Lượt 6 — review đối kháng ở phiên AI mới

> Chép nguyên văn phần **trả lời** của phiên review.
>
> **Lưu ý về tính đầy đủ:** prompt của mình cho lượt này mình không lưu lại nguyên văn,
> chỉ thuật lại trong log (đưa `02` cho một phiên hoàn toàn mới, yêu cầu tìm lỗ hổng,
> kèm câu "đừng khen phương án này"). Ghi rõ ở đây thay vì để trống.
>
> Đây là lượt tìm ra lỗi nặng nhất của cả tuần — mục (c): bảng verify dẫn số đo của
> khởi động tiến trình để chứng minh một khẳng định về integration.

---

Đọc `02-testing-levels.md` rồi. Review theo kiểu tìm lỗ hổng:
1. Chỗ dễ bị phản bác nhất trong cách phân loại
a) Bạn dùng hai trục định nghĩa mâu thuẫn nhau cùng lúc. Ở dòng 24–27 có hai tiêu chí khác hẳn nhau bị gộp làm một:

* Trục chủ đề: unit = "logic ticket + validate", integration = "JSON storage + CLI command" — lấy nguyên từ acceptance criteria.
* Trục biên: unit = "không chạm đĩa/mạng/đồng hồ", integration = "đi qua ít nhất một biên thật".

Acceptance criteria nói về phạm vi cần phủ, không phải định nghĩa cấp test. Bạn đọc một câu về coverage rồi dùng nó làm taxonomy. Khi hai trục cho ra kết quả khác nhau thì bảng phân loại không có trọng tài.
Và nó cho kết quả khác nhau ngay trong bảng của bạn: dòng 93, `tickets show <id>` id không tồn tại. Theo trục biên, nếu handler được gọi với repository in-memory thì test này không chạm biên nào → unit. Theo trục chủ đề, nó là "CLI command behavior" → integration. Bạn ghi chú ô này ở dòng 102 nhưng lại đóng khung nó là ranh giới integration/e2e — trong khi chỗ mờ thật sự là unit/integration. Người review sẽ nhắm đúng vào đó, và ghi chú hiện tại không đỡ được.
b) Định nghĩa integration của bạn rộng đến mức gần như không bác được. "Hoặc đi qua lớp xử lý lệnh CLI" — lớp command là code của chính bạn, không phải một biên. Gọi hàm của mình mà gọi là integration thì gần như test nào cũng có thể xếp vào đó. Hệ quả cụ thể: nhóm "integration" của bạn chứa hai loại test có chi phí lệch nhau hai bậc độ lớn — test ghi file thật (~chục ms) và test gọi handler in-process (~0.5ms). Toàn bộ lập luận chi phí ở phần Choosing a balance giả định integration = chậm vì chạm đĩa. Giả định đó chỉ đúng với một nửa nhóm.
c) Bằng chứng ở bảng verify không chứng minh điều bạn viết. Dòng 112: claim là "unit nhanh hơn integration một bậc", nhưng phép đo là 3 unit test so với "cả lần chạy có khởi động tiến trình". Khởi động tiến trình là e2e, không phải integration. Bạn chưa đo integration lần nào. Đây là lỗi nặng nhất về mặt bằng chứng, vì bài chấm về cách kiểm chứng, và người review chỉ cần đọc chính bảng của bạn là thấy.
d) Nhiều dòng "Unit" thật ra là dự đoán về kiến trúc chưa viết. "Ticket mới tạo có `status` mặc định là `open`" là unit chỉ khi `id` và `createdAt` được inject — chính định nghĩa của bạn cấm chạm đồng hồ. Tuần 2 chưa code, nên bảng đang trình bày như sự thật về test case cái vốn là ràng buộc thiết kế chưa cam kết. Nên nói rõ: "phân loại này giả định storage và clock được inject; nếu không, 3 dòng sau tụt xuống integration".
e) 10 ví dụ được chọn để dễ phân loại. Không có `tickets update` (1 trong 4 lệnh). Không có test sinh `id` hay `createdAt` — đúng chỗ định nghĩa unit của bạn bị thử lửa. Không có test format output của `list`, ca kinh điển gây tranh cãi. Bạn demo taxonomy trên tập ca dễ, rồi tự flag đúng 2 ca khó.
f) Lập luận "giả lập bằng mock là đang test cái mock" (dòng 100) chứng minh quá nhiều. Nếu đúng như phát biểu thì mọi error path đều phải là integration, và kim tự tháp 70/25/5 sập. Bạn cũng đang trộn "nội dung JSON hỏng" với "file hỏng": nội dung hỏng nạp được vào parser trong bộ nhớ → unit; file hỏng mới thêm phần fs/encoding/permission. Hai thứ đó khác nhau và bạn đang bảo vệ cái thứ hai bằng lý do của cái thứ nhất.
g) Vặt hơn: tỷ lệ mẫu là 50/40/10, mục tiêu ghi 70/25/5, hai con số nằm cùng một trang. Phải nói rõ 10 ca không phải mẫu theo tỷ lệ.
2. Người theo Testing Trophy sẽ phản bác thế nào
Đoạn dòng 74–77 là chỗ yếu nhất của bài: bạn tóm Trophy bằng một câu rồi bác bằng "tuần 2 chấm về quy trình TDD". Đó là đổi chủ đề, không phải phản biện — họ đưa luận điểm nhận thức (test nào cho niềm tin thật), bạn trả lời bằng luận điểm hành chính (người chấm đo gì). Họ sẽ nói: nếu tiêu chí chấm là lý do duy nhất, thì bạn không hề bảo vệ kim tự tháp, bạn chỉ tuân thủ rubric.
Các đòn cụ thể họ sẽ đánh:

1. Dùng chính bảng của bạn. Ô "Breaks when refactoring?" bạn tự viết unit là "dễ vỡ nhất". Vậy bạn thừa nhận tầng giòn nhất rồi dồn 70% ngân sách vào đó. Trophy tồn tại chính vì chi phí bảo trì này.
2. Lập luận tốc độ dựa trên số đo sai (mục c ở trên). Integration in-process với tmpdir trên Jest/Vitest tính bằng vài ms, không phải 60–95ms. Nếu integration rẻ, lý do số 1 — cái bạn xếp quan trọng nhất và là lý do duy nhất bạn dùng để loại Trophy — biến mất. Đây là đòn mạnh nhất của họ.
3. App này có logic thuần rất mỏng. Validate ticket là vài câu `if`. Rủi ro thật nằm ở parse tham số, round-trip serialize, trạng thái file, map lỗi → exit code — tức là các mối nối. Trophy nói đúng chỗ đó: trong application code (khác thư viện/thuật toán), bug sống ở seam. Và bạn tự viết ở dòng 71: "Unit và integration đều xanh mà `tickets create` vẫn hỏng là chuyện có thật" — họ sẽ trích lại câu này.
4. Bạn đã đồng ý với tiền đề của Trophy rồi. Lý do bạn giữ test JSON hỏng ở integration ("test cái mock") chính là luận điểm trung tâm của Trophy: mock trôi khỏi hành vi thật, unit test xanh giả. Bạn chấp nhận tiền đề mà từ chối kết luận, không giải thích vì sao tiền đề đó chỉ áp dụng cho một ca.
5. Bạn bỏ mất tầng đáy của Trophy: static analysis. Trophy là static → unit → integration → e2e. Snippet của bạn dùng `.ts` nhưng type-check không được tính là tầng test nào. Họ sẽ chỉ thẳng dòng 3 trong bảng — `priority` ngoài tập cho phép: với union type thì phần lớn ca này chết ở compile time, chi phí runtime bằng 0; phần còn lại (string từ argv → narrow) là chuyện ở biên CLI, tức integration theo ngôn ngữ Trophy. Một dòng "Unit" của bạn bị họ tách làm đôi và không mảnh nào ở lại unit.

Phản biện lại mà bạn nên viết sẵn (hiện chưa có trong bài): Trophy sinh ra cho app JS phía frontend, ở đó "integration" nghĩa là render cây component với con thật — khác nghĩa với "chạm đĩa" trong định nghĩa của bạn. So sánh hai tỷ lệ mà không quy về cùng một nghĩa "integration" là so sánh sai đơn vị. Đây mới là chỗ đứng vững, nhưng nó chỉ có giá trị nếu bài viết ra — và viết ra thì lại buộc bạn thừa nhận mục (b): định nghĩa integration của bạn đang gộp hai thứ khác nhau.
Ba việc sửa đáng giá nhất, theo thứ tự: đo thật một integration test in-process rồi sửa dòng 112; chọn một trục định nghĩa duy nhất và nói rõ trục kia là hệ quả; viết lại đoạn Trophy thành phản biện đúng luận điểm thay vì viện dẫn rubric.