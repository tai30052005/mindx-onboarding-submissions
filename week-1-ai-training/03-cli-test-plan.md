# Test Plan for the Ticket Manager CLI

> **Deliverable 3.** Snippets only — the project itself is built in week 2.
> This file doubles as the working spec for week 2.

Scope taken from `docs/plans/week-2/overview.md`: a CLI storing tickets in local JSON
files, with fields `title`, `description`, `status`, `priority`, `tags`, and the commands
`tickets create`, `tickets list`, `tickets show <id>`, `tickets update <id>`.

## Questions this file answers

- What should be tested for each of the four commands? `[đề bài]`
- What are the validation rules, and how is each one tested? `[đề bài]`
- How is the JSON file storage layer tested? `[đề bài]`
- How are the three required error cases tested? `[đề bài]`
- Which of these tests are unit tests and which are integration tests? `[thêm]`

## Test cases by command

### `tickets create`

| # | Behaviour under test | Level | Expected result |
|---|---|---|---|
|  |  |  |  |

### `tickets list` (including filters by status / priority / tags)

| # | Behaviour under test | Level | Expected result |
|---|---|---|---|
|  |  |  |  |

### `tickets show <id>`

| # | Behaviour under test | Level | Expected result |
|---|---|---|---|
|  |  |  |  |

### `tickets update <id>`

| # | Behaviour under test | Level | Expected result |
|---|---|---|---|
|  |  |  |  |

## Required error cases

`docs/plans/week-2/overview.md` requires these three explicitly:

| Error case | How to trigger it in a test | Expected behaviour |
|---|---|---|
| Invalid input | | |
| Ticket not found | | |
| Missing / corrupted JSON file | | |

## Illustrative snippets

> _Cần trả lời: 2–3 snippet Jest cho thấy hình dạng của một test. Giữ nhất quán cú pháp
> Jest trong toàn bộ tài liệu — đừng trộn với Vitest._

```ts
// TODO
```

## How I verified this

| Claim | How I checked it |
|---|---|
|  |  |

## Still unsure about

-
