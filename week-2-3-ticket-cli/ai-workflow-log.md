# Nhật ký làm việc với AI — tuần 2

> Đề tuần 2: *"Use AI with control through proper guardrails and validation
> (apply workflows from Week 1)"*.
>
> File này ghi chỗ nào mình tự làm, chỗ nào nhờ AI, và kiểm chứng bằng cách nào.
> Đối chiếu được với `git log` của thư mục này.

## Phần 1 — Ranh giới dùng AI

**Mình tự viết được bao nhiêu:** không có phần nào. 471 dòng trong `src/` và 481 dòng
test đều do AI viết.

**Mình tự làm gì:** chỉ bảo AI làm tuần 2, rồi bảo AI giải thích lại cho mình.

**Có kiểm lời giải thích đó không:** nhận luôn. Không chạy thử, không mở file đối chiếu,
không hỏi lại chỗ nào.

Ghi đúng ba dòng trên vì đề tuần 2 chấm chuyện dùng AI có kiểm soát. Nộp bản không kiểm
gì mà khai là có kiểm thì hỏng cả file này lẫn file tuần 1.

## Phần 2 — Ngày 11/09: tự chạy thử, và tìm ra lỗi

Trước hôm đó mình chưa gõ một lệnh nào của chương trình này. Mở terminal, gõ lệnh đầu
tiên theo đúng `package.json`:

```bash
npm run tickets -- create --title "Sua loi dang nhap" --priority high
```

Chương trình chết ngay, không tạo được ticket nào:

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module
  '...\week-2-3-ticket-cli\src\commands\run'
  imported from ...\week-2-3-ticket-cli\src\index.ts
```

**Nguyên nhân.** 30 import nội bộ trong `src/` đều viết thiếu đuôi file, kiểu
`from './commands/run'`. Script `tickets` trỏ thẳng vào `src/index.ts`, Node thấy cú pháp
`import` nên coi file đó là ESM, mà ESM bắt buộc ghi đủ đuôi. Chết ở dòng import đầu,
trước khi chạy được dòng logic nào.

**Vì sao không ai bắt được.** Jest với `ts-jest` phân giải đường dẫn kiểu CommonJS nên tự
đoán được đuôi. `tsc` cũng vậy, vì `tsconfig` đặt `"module": "commonjs"`. Nên 50 test
xanh hết và `tsc --noEmit` sạch, trong khi chương trình không khởi động được.

**Lúc đó mình nghĩ nó sẽ chạy được, vì các test đều xanh.**

Tuần trước mình viết trong `../week-1-ai-training/04-ai-validation.md`:

> Xanh hết không có nghĩa là code đúng.

Viết ra rồi vẫn làm ngược lại. Lý do thật là: vì thấy xanh thì tin.

Và lỗi này đúng loại mình đã tả ở `../week-1-ai-training/02-testing-levels.md`:

> Cần e2e vì unit xanh hết, integration xanh hết mà gõ lệnh vẫn hỏng, ví dụ vì không nối
> lệnh vào chương trình.

Tuần 2 có 50 test, không có test e2e nào.

### Vá theo vòng Red-Green

| Bước | Commit | Kết quả |
|---|---|---|
| Viết test e2e khởi động cả chương trình | `fd7a6a2` | **Đỏ 3/3**, đều báo `ERR_MODULE_NOT_FOUND` |
| Đổi script thành `tsc && node dist/index.js` | `b95e2c0` | **Xanh**, cả bộ 54/54 |

Mình tự chạy, tự nhìn output đỏ trước khi sửa, và tự chạy lại sau khi sửa.

Chọn cách sửa script vì nó đụng một dòng và không làm vỡ 50 test cũ. Cách đúng hơn là
thêm đuôi `.js` cho cả 30 import rồi chuyển hẳn sang ESM, nhưng phải sửa thêm `tsconfig`
và cấu hình `ts-jest`. Lý do không chọn cách đó là sắp đến hạn nộp, không phải vì nó dở.

### Test e2e đầu tiên cũng viết sai hai lần

Lần 1: truyền mảng tham số kèm `shell: true`, shell nối lại rồi cắt theo khoảng trắng nên
title `"Ticket e2e"` bị cắt còn `Ticket`.

Lần 2: tự bọc dấu ngoặc kép, thì `cmd.exe` chèn thêm ký tự thoát, ra `^Ticket^ e2e^`.

Cuối cùng tách làm hai tầng: một test đi qua `npm` chỉ để kiểm chương trình khởi động
được, ba test còn lại gọi thẳng `node dist/index.js` nên không dính chuyện thoát ký tự.

Cả hai lần sai đều do output đỏ chỉ ra chỗ sai. Đó đúng là lý do 1 trong
`../week-1-ai-training/01-tdd-principles.md`: test phải đỏ một lần thì mới tin được nó.

Sau bước này tầng e2e có 4 trên 54 test, khoảng 7%. Tỷ lệ mình đề xuất ở `02` là 5%.

## Phần 3 — Bốn việc có dấu vết trong git

### 1. Bug cột `id`, test vẫn xanh mà output sai

Commit `858b25a` (02/09 00:02). Hàm `formatLine` ban đầu dùng cột rộng cố định:

```ts
return t.id.padEnd(6) + t.status.padEnd(13) + t.priority.padEnd(8) + t.title;
```

Test dùng id `'T-1'`, 3 ký tự, `padEnd(6)` chèn thêm 3 dấu cách nên nhìn ổn. Id thật sinh
ra dài 8 ký tự, `padEnd(6)` chèn 0 dấu cách, nên cột `id` dính liền vào cột `status`.

```ts
return [t.id.padEnd(8), t.status.padEnd(11), t.priority.padEnd(6), t.title].join('  ');
```

Thêm test `'id 8 ký tự vẫn cách cột status ra'` để lần sau bắt được.

**Ai tìm ra:** AI tìm lúc kiểm tra, không phải mình gõ lệnh rồi thấy. Cùng loại với lỗi
`ERR_MODULE_NOT_FOUND` ở Phần 2, cả hai đều chỉ lộ khi chạy thật, nhưng lỗi đó thì mình
tự tìm, còn lỗi này thì không.

### 2. Tự soát lại theo kế hoạch tuần 1

Commit `d83913b` (03/09 02:16). Đối chiếu từng ca test trong `03-cli-test-plan.md` với
test đã viết, thiếu ba ca integration nên bổ sung: `list` đọc từ file thật rồi lọc, `show`
với id tồn tại đọc từ file thật, và `update` ticket này không làm hỏng ticket kia.

### 3. Bước Refactor

Commit `1d78c63` (02/09 00:06). `run.ts` từ 156 dòng rút còn phần điều phối, bốn lệnh
tách ra `create.ts`, `list.ts`, `show.ts`, `update.ts`, cộng `flags.ts` và `deps.ts`. Test
không sửa dòng nào, vẫn xanh.

### 4. Ba quyết định thiết kế

Tiêm `now`/`generateId` thay vì gọi thẳng, hàm lệnh trả về exit code thay vì gọi
`process.exit()`, và mỗi integration test một thư mục tạm riêng.

**Tuần 2 không quyết gì mới.** Cả ba đã chốt ở `03-cli-test-plan.md` từ tuần 1, kèm lý
do. Bộ bốn lệnh `create`/`list`/`show`/`update` thì lấy từ đề bài
`docs/plans/week-2/overview.md`. Việc tách `NotFoundError` khỏi lỗi validate cũng đã ghi
ở `03`. Tuần 2 chỉ thực thi.

## Phần 4 — Nhịp commit

`git log` cho thấy 12 commit dồn từ 23:54 đến 00:01 ngày 01/09, trong đó có 6 cặp
RED/GREEN. Nhìn vào thì tưởng mình đi từng vòng TDD và nhìn từng lần đỏ.

Thực tế là AI chạy liền một mạch. Mình không xem lần đỏ nào trong 12 commit đó.

Khai ra vì nếu không thì `git log` thành bằng chứng gây hiểu nhầm. Cặp duy nhất mình tự
chạy và tự nhìn đỏ là `fd7a6a2` rồi `b95e2c0`, ngày 11/09.

## Phần 5 — Guardrail cho tuần 3

Tuần 3 cắm HTTP client vào chính codebase này, và lại nhờ AI viết.

**Việc sẽ làm khác đi: chạy thử lệnh thật trước khi tin.**

Không phải nguyên tắc chung, là một việc gõ được trong 5 phút. Tuần 2 mình bỏ đúng bước
đó, và cái giá là nộp một chương trình không khởi động được với 50 test xanh.
