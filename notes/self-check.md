# Self-check — Tuần 1

Hai trong bốn acceptance criteria của tuần 1 được chấm **bằng miệng**, sau khi nộp bài:

- *Research findings can be explained clearly when submitting*
- *Questions about TDD, test types, and AI-generated code validation can be answered based on research*

File này để tự kiểm tra trước buổi đó. Cách dùng: **đóng hết tài liệu lại, trả lời thành tiếng.**
Đọc thầm luôn tạo cảm giác đã hiểu; nói ra mới lộ chỗ hổng.

---

## Bản tóm tắt 2 phút

Buổi phỏng vấn ~30 phút, người hỏi đã đọc bài trước. Thực tế sẽ là: ~5 phút mình tóm tắt,
~20 phút đào sâu 2–3 chỗ, ~5 phút cuối mình hỏi lại. Nên phần mở đầu định hình phần còn lại.

Tập nói trơn năm ý này, không nhìn giấy:

1. Mình research gì, theo thứ tự nào
2. Ba workflow dùng cho phần nào, vì sao chọn vậy
3. Một quyết định mình tự đưa ra và lý do (cách test JSON storage)
4. Một lần AI sai và mình phát hiện thế nào
5. Phần này giúp gì cho tuần 2

---

## Câu hỏi tự kiểm

### TDD

- [ ] TDD là gì? Vì sao nói nó là kỹ thuật **thiết kế**, không chỉ là kỹ thuật viết test?
- [ ] Red / Green / Refactor — mỗi bước làm gì?
- [ ] Vì sao phải **chạy và thấy test đỏ** trước khi viết code?
- [ ] "Minimal implementation" ở bước Green là tối thiểu tới mức nào? Hardcode có được không?
- [ ] Bước Refactor có được sửa test không? Sửa test và sửa code cùng lúc thì mất gì?
- [ ] Vì sao viết test trước? Viết sau mất gì cụ thể?
- [ ] Khi nào TDD **không** phù hợp?

### Các cấp độ test

- [ ] Unit / integration / e2e khác nhau ở đâu?
- [ ] Cho một test cụ thể — nó thuộc tầng nào, vì sao?
- [ ] Tỷ lệ hợp lý giữa ba tầng? Vì sao không viết toàn e2e cho chắc?
- [ ] Test nào dễ vỡ khi refactor? Vì sao?

### Test cho CLI

- [ ] Với `tickets create`, mình test những gì?
- [ ] Muốn test tình huống file JSON hỏng thì tạo tình huống đó bằng cách nào?
- [ ] Test lọc theo tags là unit hay integration?

### AI validation

- [ ] Test kiểm soát code AI sinh ra bằng cách nào?
- [ ] Nếu để AI viết **cả test lẫn code** thì vấn đề nằm ở đâu?
- [ ] Mình phát hiện AI nói sai bằng cách nào? **Kể một lần cụ thể.**

### Quy trình

- [ ] Workflow nào dùng cho phần nào? Vì sao chọn cái đó chứ không phải cái kia?
- [ ] Có chỗ nào mình **không đồng ý** với AI và làm khác không?
- [ ] Làm lại từ đầu thì mình làm khác chỗ nào?

### Bảo vệ quyết định

- [ ] Mình chọn cách test JSON storage nào? Vì sao loại hai cách kia?
- [ ] **Nếu ràng buộc đổi** — team 5 người, hoặc phải chạy CI mỗi commit — có đổi quyết định không?

---

## Ba nguyên tắc trong buổi phỏng vấn

**Kể chuyện cụ thể thắng nói lý thuyết.** Dạng câu mạnh nhất: *"Lúc làm phần X, AI bảo Y,
mình kiểm lại thấy sai vì Z, nên sửa thành W."* Kho chuyện nằm ở `ai-workflow-log.md`.

**Chưa chắc thì nói chưa chắc.** Cả tuần này dạy *never blindly accept* và *always question
and verify*. Bịa trong buổi phỏng vấn là hỏng đúng thứ đang được chấm. Nói *"chỗ này em mới
đọc chứ chưa kiểm chứng"* là điểm cộng.

**Năm phút cuối cũng đang được chấm.** Anh mentor nói hỏi là kỹ năng quan trọng nhất — đừng
để trống chỗ đó. Chuẩn bị sẵn:

- "Anh thấy phần nào trong bài của em còn yếu nhất để em cải thiện ở tuần 2 ạ?"
- "Sang tuần 2 anh muốn em ưu tiên kỷ luật TDD hay tốc độ ra sản phẩm hơn ạ?"

---

## Bài test giọng văn

Đọc từng đoạn trong `01`–`05`, tự hỏi: **"mình nói lại được câu này bằng lời của mình không?"**

Không được → viết lại cho giống cách mình nói, hoặc xóa.

Người hỏi đã đọc văn bản của mình trước khi vào phỏng vấn. Khoảng cách giữa giọng viết và
giọng nói là thứ lộ ra rõ nhất trong 30 phút.
