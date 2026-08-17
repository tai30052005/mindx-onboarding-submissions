# AI Workflow Log

> **Deliverable 6 / Acceptance criterion 2** — *"Research process with AI is tracked:
> workflows applied and iterations documented."*
>
> This is the only criterion that cannot be recovered later. Write each entry
> **during** the session, not afterwards.

---

## Part 1 — Summary

| Workflow | Used for | Iterations | Outcome |
|---|---|---|---|
| Layered Questioning | `01-tdd-principles.md`, `02-testing-levels.md` | | |
| Solution Exploration | Decision: how to test the JSON storage layer | | |
| Iterative Refinement | `05-common-mistakes.md` | | |

**Decision I made myself:**

> _Một dòng: chọn gì, vì sao, rủi ro đã biết._

---

## Part 2 — Session log

Template per exchange — five lines, filled in as I go:

```
Hỏi gì:
Assumptions AI đang giả định:
Risks / edge case bị bỏ:
Mình verify bằng cách nào:
Mình sửa lại gì, vì sao:
```

### 18/08 — Layered Questioning (TDD)

**Tier 1 — Research**

**Tier 2 — Brief feature** (áp vào Ticket Manager CLI)

**Tier 3 — Code example**

**Tier 4 — Validation** (edge cases)

### 19/08 — Testing levels

### 20/08 — Solution Exploration: testing the JSON storage layer

> _5 bước: nêu bối cảnh → AI liệt kê vấn đề → khai thác phương án kèm pros/cons →
> **thêm ràng buộc của mình rồi tự chọn** → tổng hợp (chọn gì, vì sao, rủi ro)._

**Options considered**

| Option | Pros | Cons |
|---|---|---|
| Real files in a temp directory | | |
| Mock the `fs` module | | |
| Storage behind an interface + in-memory implementation | | |

**My constraints:** làm một mình · 5 tuần · tuần 3 phải cắm thêm HTTP client

**Chosen:** — **Why:** — **Known risk:**

### 21/08 — Iterative Refinement (test file review)

> _6 bước. Bước 4 là **mình tự sửa**, không nhắn "sửa giúp tôi" — đó là ranh giới
> giữa "you are the architect" và AI làm architect._

**1. AI's output**

**2. Issues I found myself** (before asking anything)

**3. My summary of the problems**

**4. My revised version**

**5. What I fed back**

**6. What the AI added after that**

---

## Part 3 — Hallucinations caught

Labels from `slides-ai-training.md`: `wrong facts/code` · `unnecessary icons/emojis` ·
`invented API` · `outdated information`

| # | Label | What the AI claimed | How I verified it was wrong | How I corrected it explicitly |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |

> Corrections only hold inside the current conversation — a new session starts clean.
> Anything worth keeping goes into a rules file, per rule 10 of `.cursor/rules/overview.mdc`.
