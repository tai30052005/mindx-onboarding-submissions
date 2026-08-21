# Week 1 — AI Training: Effective Usage & Critical Thinking

**Period:** 18/08/2026 → 25/08/2026
**Research topic:** Test-Driven Development for building reliable CLI tools with AI assistance

## Suggested reading order

1. [01-tdd-principles.md](01-tdd-principles.md) — what TDD is
2. [02-testing-levels.md](02-testing-levels.md) — unit / integration / e2e
3. [03-cli-test-plan.md](03-cli-test-plan.md) — test plan for the Ticket Manager CLI
4. [04-ai-validation.md](04-ai-validation.md) — how tests control AI-generated code
5. [05-common-mistakes.md](05-common-mistakes.md) — testing mistakes and how to avoid them
6. [ai-workflow-log.md](ai-workflow-log.md) — process: 3 workflows + hallucinations caught
7. [experiments/](experiments/) — bốn thí nghiệm tự chạy, dùng để kiểm chứng thay vì tin lời AI

## Acceptance criteria → where it is

| Acceptance criteria | Where | Done |
|---|---|---|
| Research content documented: TDD principles, testing levels, CLI test examples, AI validation | `01`, `02`, `03`, `04` | ☑ |
| Research process with AI tracked: workflows applied and iterations documented | `ai-workflow-log.md` | ☑ |
| Research findings can be explained clearly when submitting | *(interview)* | ☐ |
| Questions about TDD, test types, AI-generated code validation can be answered | *(interview)* | ☐ |

## Deliverables → where it is

| # | Deliverable | Where | Done |
|---|---|---|---|
| 1 | Core principles of TDD and Red-Green-Refactor | `01` | ☑ |
| 2 | Comparison of unit / integration / e2e tests | `02` | ☑ |
| 3 | Examples of tests for a Ticket Manager CLI | `03` | ☑ |
| 4 | How testing helps control AI-generated implementation | `04` | ☑ |
| 5 | Common testing mistakes and how to avoid them | `05` | ☑ |
| 6 | Evidence of applying all 3 workflows | `ai-workflow-log.md` | ☑ |

## Decisions recorded

- **Snippets only, no runnable project.** Confirmed by mentor on 17/08: *"Snippet là đủ.
  Tuần 2 e mới làm project nhé."* All test examples in this folder are illustrative
  snippets; the actual project starts in week 2.
- **Test framework: Jest**, used consistently across all snippets, matching the stack
  fixed for the program in `docs/plans/week-3/architecture.md`.

## Question tags

Each question under *Questions this file answers* is tagged by where it comes from:

- `[đề bài]` — named in `docs/plans/week-1/overview.md` (Research focus / Deliverable). Required.
- `[thêm]` — added on my own judgement of what the review session is likely to probe,
  since acceptance criteria 3 and 4 are assessed orally but list no specific questions.
  Useful, but not required by the brief.
