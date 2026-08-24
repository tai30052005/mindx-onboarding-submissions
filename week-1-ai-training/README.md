# Tuần 1 — AI Training: Effective Usage & Critical Thinking

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

| Tiêu chí chấm | Nằm ở đâu | Xong |
|---|---|---|
| Research content documented: TDD principles, testing levels, CLI test examples, AI validation | `01`, `02`, `03`, `04` | ☑ |
| Research process with AI tracked: workflows applied and iterations documented | `ai-workflow-log.md` | ☑ |
| Research findings can be explained clearly when submitting | *(interview)* | ☐ |
| Questions about TDD, test types, AI-generated code validation can be answered | *(interview)* | ☐ |

## Deliverable → nằm ở đâu

| # | Deliverable | Nằm ở đâu | Xong |
|---|---|---|---|
| 1 | Core principles of TDD and Red-Green-Refactor | `01` | ☑ |
| 2 | Comparison of unit / integration / e2e tests | `02` | ☑ |
| 3 | Examples of tests for a Ticket Manager CLI | `03` | ☑ |
| 4 | How testing helps control AI-generated implementation | `04` | ☑ |
| 5 | Common testing mistakes and how to avoid them | `05` | ☑ |
| 6 | Evidence of applying all 3 workflows | `ai-workflow-log.md` | ☑ |

## Các quyết định đã chốt

- **Chỉ đoạn code minh hoạ, không có project chạy được.** Mentor đã chốt ngày 17/08: *"Snippet là đủ.
  Tuần 2 e mới làm project nhé."* Mọi ví dụ test trong thư mục này đều là đoạn minh hoạ;
  project thật bắt đầu từ tuần 2.
- **Framework test: Jest**, dùng nhất quán trong mọi đoạn code, khớp với stack mà
  chương trình đã chốt ở `docs/plans/week-3/architecture.md`.

## Nhãn câu hỏi

Mỗi câu hỏi ở mục *Những câu hỏi file này trả lời* đều gắn nhãn nguồn gốc:

- `[đề bài]` — đề bài nêu trong `docs/plans/week-1/overview.md` (Research focus / Deliverable). Bắt buộc.
- `[thêm]` — mình tự thêm, theo phán đoán buổi review sẽ đào vào đâu, vì tiêu chí 3 và 4
  chấm bằng miệng nhưng không liệt kê câu hỏi cụ thể nào. Hữu ích, nhưng đề bài không
  bắt buộc.
