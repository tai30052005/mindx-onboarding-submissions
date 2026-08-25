# Transcripts — phiên làm việc với AI, chép nguyên văn

Bằng chứng sơ cấp cho **Deliverable 6** và **Acceptance criterion 2**
(*"Research process with AI is tracked: workflows applied and iterations documented"*).

`../ai-workflow-log.md` là bản **thuật lại** — có tóm tắt, có diễn giải, và viết sau khi
sự việc đã xảy ra. Thư mục này là bản **gốc**, để ai đọc cũng đối chiếu được hai bên có
khớp nhau không.

| File | Lượt | Có prompt gốc | Nội dung |
|---|---|---|---|
| [luot-1-tdd-co-ban.md](luot-1-tdd-co-ban.md) | 1 | ✓ | TDD là gì, R-G-R, tách đồng thuận khỏi quan điểm |
| [luot-2-gia-dinh.md](luot-2-gia-dinh.md) | 2 | ✓ | Bắt AI tự liệt kê giả định — lôi ra 6 giả định về trình độ, 4 giả định sai về bài toán |
| [luot-3-ba-ly-do.md](luot-3-ba-ly-do.md) | 3 | ✓ | Ba lý do viết test trước, TDD là thiết kế, khi nào TDD không hợp |
| [luot-4-phan-bien.md](luot-4-phan-bien.md) | 4 | ✓ | Lý do nào yếu nhất, và phản biện *"viết test sau cũng được"* |
| [luot-6-review-doi-khang.md](luot-6-review-doi-khang.md) | 6 | ✗ | Phiên AI mới đọc `02` và tìm lỗ hổng |

## Ba chỗ thiếu, ghi rõ thay vì để trống

- **Lượt 6 không có prompt gốc.** Mình chỉ lưu phần trả lời. Nội dung đã hỏi được thuật
  lại trong log: đưa `02` cho một phiên hoàn toàn mới, yêu cầu tìm chỗ dễ bị phản bác
  nhất, kèm câu *"đừng khen phương án này"*.
- **Lượt 5 không có transcript.** Lượt đó làm trong phiên Claude Code chứ không phải
  phiên hỏi đáp riêng, nên không có đoạn hội thoại tách rời để chép. Dấu vết của nó nằm
  ở commit `26ec88a` — bản đầu của `02` với tỷ lệ 70/25/5.
- **Solution Exploration và Iterative Refinement không có transcript.** Chỉ có kết quả:
  bảng ba phương án trong log, và cặp file trước/sau trong `../experiments/refinement/`.

## Đối chiếu nhanh: transcript nói gì, bài nộp giữ lại gì

Đây là chỗ đáng đọc nhất, vì nó cho thấy phần nào là của AI và phần nào bị loại.

| Transcript đưa ra | Bài nộp | Lý do loại, ghi ở |
|---|---|---|
| Lượt 3: **5 lý do** viết test trước | `01` giữ **3** | Lý do 5 là chuyện thói quen làm việc, không phải cơ chế của TDD → bị vặn là đuối |
| Lượt 3: **5 tình huống** TDD không hợp, có "thẩm mỹ" và "throwaway" | `01` giữ **3** | Hai cái kia yếu nhất |
| Lượt 3: đề nghị nhét cặp file `codeFirst.ts` / `testFirst.ts` vào `01` | Từ chối, chuyển snippet sang `03` | `01` giữ thuần khái niệm |
| Lượt 1: dựng cả project chạy được, `npm init`, `jest.config.js` | Bỏ hết | Mentor đã chốt 17/08: tuần 1 snippet là đủ |
| Lượt 2: dẫn nghiên cứu Fucci et al. | Không dùng ở phần chính | AI tự nhận dẫn từ trí nhớ, mình không tra được nguồn |
| Lượt 4: nói lý do 3 sai ở đâu | Chấp nhận, viết lại toàn bộ lý do 3 | Nhưng chỉ sau khi tự chạy `faketimer.test.js` để kiểm — 3/3 pass |
| Lượt 6: nói bảng verify dẫn số đo sai | Chấp nhận, đổi tỷ lệ 70/25/5 → 50/45/5 | Nhưng chỉ sau khi tự viết `bench.test.js` đo lại |

Hai dòng cuối là điểm chính: cả hai lần AI phản bác đúng, nhưng mình không nhận lời ngay
mà tự chạy lại phép đo rồi mới sửa.
