# Tuần 1 — AI Training: dùng AI hiệu quả và tư duy phản biện

**Thời gian:** 18/08/2026 → 25/08/2026
**Chủ đề nghiên cứu:** Test-Driven Development, để làm CLI đáng tin khi có AI hỗ trợ

## Thứ tự nên đọc

1. [01-tdd-principles.md](01-tdd-principles.md) — TDD là gì
2. [02-testing-levels.md](02-testing-levels.md) — ba tầng unit / integration / e2e
3. [03-cli-test-plan.md](03-cli-test-plan.md) — kế hoạch test cho Ticket Manager CLI
4. [04-ai-validation.md](04-ai-validation.md) — test kiểm soát code AI sinh ra bằng cách nào
5. [05-common-mistakes.md](05-common-mistakes.md) — lỗi test thường gặp và cách tránh
6. [ai-workflow-log.md](ai-workflow-log.md) — quá trình: 3 workflow và những chỗ AI nói sai
7. [experiments/](experiments/) — bốn thí nghiệm tự chạy, dùng để kiểm chứng thay vì tin lời AI
8. [transcripts/](transcripts/) — phiên làm việc với AI, chép nguyên văn, để đối chiếu với log

## Tiêu chí chấm → nằm ở đâu

Nguyên văn tiếng Anh của tiêu chí và deliverable nằm ở `docs/plans/week-1/overview.md`;
ở đây dịch lại để cả file dùng một ngôn ngữ.

| Tiêu chí chấm | Nằm ở đâu | Xong |
|---|---|---|
| Nội dung nghiên cứu được ghi lại: nguyên tắc TDD, các tầng test, ví dụ test cho CLI, kiểm chứng code AI | `01`, `02`, `03`, `04` | ☑ |
| Quá trình làm việc với AI được ghi lại: dùng workflow nào, lặp bao nhiêu vòng | `ai-workflow-log.md` | ☑ |
| Trình bày được rõ ràng kết quả nghiên cứu khi nộp bài | *(hỏi trực tiếp)* | ☐ |
| Trả lời được câu hỏi về TDD, các loại test, cách kiểm chứng code AI sinh ra | *(hỏi trực tiếp)* | ☐ |

## Deliverable → nằm ở đâu

| # | Deliverable | Nằm ở đâu | Xong |
|---|---|---|---|
| 1 | Nguyên tắc cốt lõi của TDD và vòng Red-Green-Refactor | `01` | ☑ |
| 2 | So sánh test unit / integration / e2e | `02` | ☑ |
| 3 | Ví dụ test cho CLI quản lý ticket | `03` | ☑ |
| 4 | Test giúp kiểm soát code AI sinh ra như thế nào | `04` | ☑ |
| 5 | Lỗi test thường gặp và cách tránh | `05` | ☑ |
| 6 | Bằng chứng đã áp dụng cả 3 workflow | `ai-workflow-log.md` | ☑ |

## Các quyết định đã chốt

- **Chỉ đoạn code minh hoạ, không có project chạy được.** Mentor đã chốt ngày 17/08:
  *"Snippet là đủ. Tuần 2 e mới làm project nhé."* Mọi ví dụ test trong thư mục này đều là
  đoạn minh hoạ. Project thật ở [`../week-2-3-ticket-cli/`](../week-2-3-ticket-cli/), làm
  đúng theo kế hoạch trong `03-cli-test-plan.md`.
- **Framework test: Jest**, dùng nhất quán trong mọi đoạn code, khớp với stack chương
  trình đã chốt ở `docs/plans/week-3/architecture.md`. Tuần 2 dùng đúng stack này.

