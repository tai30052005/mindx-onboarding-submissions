# Lượt 1 — TDD là gì, Red / Green / Refactor

> Chép nguyên văn phiên AI. Không sửa, không cắt.
> Tương ứng mục **Lượt 1** trong `../ai-workflow-log.md`.
> Phần đầu là prompt của mình, phần sau là trả lời của AI.

---

Tôi là intern, chưa từng dùng TDD, chưa từng viết unit test.
Tuần này tôi phải nghiên cứu TDD và tuần sau build một CLI quản lý ticket
bằng TypeScript + Jest theo TDD.
Vì tôi không có kinh nghiệm để tự phát hiện bạn nói sai, hãy làm 3 việc:
1. Giải thích TDD là gì, và chuyện gì xảy ra trong từng bước
   Red / Green / Refactor. Dùng một ví dụ cụ thể chạy được, không nói chung chung.
2. Nói rõ chỗ nào là ĐỒNG THUẬN trong ngành, chỗ nào là QUAN ĐIỂM
   còn tranh cãi. Tách riêng hai phần đó.
3. Chỉ ra 2-3 điều mà người mới học TDD thường hiểu sai.
Trả lời bằng tiếng Việt.
Tôi sẽ dựng thật ví dụ này và chạy nó, để những gì tôi nói về output không phải là tôi nhớ mà là tôi đã kiểm chứng.

---

> _Chỉ giữ đoạn được dẫn trong bảng đối chiếu: AI dựng cả một project chạy được._
> _Mình bỏ hết phần này khỏi `01` vì mentor đã chốt 17/08 rằng tuần 1 snippet là đủ._
> _Toàn bộ phần còn lại ở commit `31c9f97`._

Setup (đã kiểm chứng, có một cái bẫy thật)
npm init -y && npm i -D jest ts-jest @types/jest "typescript@^5"
Chú ý typescript@^5. Tôi thử cài typescript không ghim version, npm kéo về TypeScript 7.0.2, và ts-jest 29 từ chối chạy:
The TypeScript compiler "typescript" (version 7.0.2) does not expose the
JavaScript compiler API required by ts-jest.
Tuần sau bạn sẽ đâm đầu vào đúng lỗi này nếu không ghim. jest.config.js:
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = { preset: 'ts-jest', testEnvironment: 'node' };
