# Những lỗi test thường gặp và cách tránh

> **Deliverable 5.** Bốn lỗi dưới đây là bốn lỗi đề bài nêu. Ví dụ lấy từ buổi
> Iterative Refinement thật của mình, ghi ở `ai-workflow-log.md` mục 20/08.

## 1. Test thừa

Viết test kiểm `1 + 1 === 2`, hay kiểm `Array.filter` của JavaScript chạy đúng — không
có ích, vì đó là code của JavaScript rồi, đã có người test.

Mình chỉ test code của mình. Test lại thư viện thì tốn công viết, và tốn công sửa mỗi
lần thư viện đổi.

## 2. Assertion yếu

Assertion yếu là test vẫn xanh nhưng không kiểm được giá trị có đúng không.

```js
expect(t.createdAt).toBeDefined();
```

Câu này chỉ hỏi một chuyện: *có phải `undefined` không?*. Nên `"abcxyz"` cũng xanh, `0`
cũng xanh, ngày sai bét cũng xanh. Viết chắc thì phải là:

```js
expect(t.createdAt).toBe('2026-08-20T10:00:00.000Z');
```

Chỗ nguy là nó **trông giống test thật** — vẫn chạy, vẫn xanh, vẫn được tính coverage.
Nên mình tưởng chỗ đó có bảo vệ, thật ra không có.

## 3. Test vào chi tiết cài đặt

Hàm tính tổng tiền, mà test lại đi kiểm bên trong hàm có gọi `Array.reduce` không.

Sửa `reduce` thành vòng `for`, kết quả vẫn đúng y hệt, nhưng test đỏ — **đỏ dù chẳng có
gì hỏng**. Test đó bám vào cách làm chứ không bám vào kết quả.

Hậu quả: mỗi lần dọn code là test đỏ, nên refactor thành ra tốn kém. Mà refactor là bước
thứ ba của TDD.

## 4. Tin output của AI mà không kiểm

Viết ở `04-ai-validation.md`. Tóm lại: AI viết cả test lẫn code thì test mô tả cái code
đang làm, không phải cái đáng lẽ phải làm — code sai thì test sai theo và vẫn xanh.

## Trước và sau, lấy từ buổi refinement của mình

File gốc: `experiments/refinement/ticket.test.ts` — 6 test, 10 vấn đề.
Bản sửa: `experiments/refinement/ticket.revised.test.ts`.

**Trước** — hai lỗi nặng nhất:

```ts
const STORE_PATH = './tickets.json';   // dung chung, ghi vao thu muc lam viec that

it('tạo được ticket', () => {
  const t = createTicket({ title: 'Fix login bug' });
  expect(t).toBeDefined();
  expect(t.id).toBeTruthy();
});
```

**Sau**:

```ts
const deps = {
  now: () => new Date('2026-08-20T10:00:00.000Z'),
  generateId: () => 'T-1',
};

describe('JsonTicketStore', () => {
  let dir: string;
  beforeEach(() => { dir = mkdtempSync(join(tmpdir(), 'tickets-')); });
  afterEach(() => { rmSync(dir, { recursive: true, force: true }); });
  // ...
});

it('gán status mặc định là open', () => {
  const t = createTicket({ title: 'Fix login bug' }, deps);
  expect(t.status).toBe('open');
});

it('sinh id từ generateId được tiêm', () => {
  const t = createTicket({ title: 'Fix login bug' }, deps);
  expect(t.id).toBe('T-1');
});
```

Chú ý một test yếu bị tách thành hai test có tên nói rõ hành vi. Và `expect(t.id).toBe('T-1')`
chỉ viết được **nhờ** đã tiêm `generateId` — tức là sửa một assertion yếu kéo theo một
thay đổi thiết kế. Đây đúng là luận điểm "TDD là hoạt động thiết kế" ở `01`, lần này gặp
theo chiều ngược lại.

## Cái gì mình tự tìm ra, cái gì phải được chỉ

Ghi thẳng vì đây là tuần chấm về critical thinking, và một bản tự đánh giá trung thực
đáng tin hơn một danh sách hoàn hảo.

| | Số lượng |
|---|---|
| Mình tự tìm ra trước khi hỏi | **0 / 10** |
| Phải được chỉ ra | 10 / 10 |

Không tự tìm được lỗi nào. Lúc đọc file test đó mình thấy nó bình thường.

Nhóm mình mù hẳn là **weak assertions**. Đọc `expect(t).toBeDefined()` và
`expect(t.id).toBeTruthy()` mình không thấy có gì sai, vì chưa có phản xạ hỏi
*"khẳng định này vẫn đúng với những giá trị sai nào?"*. Sau khi được chỉ ra và tự chạy
lại `experiments/async-check/faketimer.test.js` thì mới thấy: `toBeDefined()` xanh với
cả `"abcxyz"` lẫn `0`.

Nhóm thứ hai là các lỗi **không nhìn thấy khi đọc**: thiếu `await` trong test async,
dùng chung đường dẫn file khi chạy song song, thiếu dọn dẹp. Chúng không sai cú pháp,
không sai logic khi đọc từng dòng — chỉ sai khi chạy thật. Cái thiếu `await` mình đã tự
chạy lại được ở `async-check/async-test.test.js`, và chính Node in ra dòng
*"would have caused the test to fail"*.


## Còn chưa chắc

- Tự tìm được 0/10 lỗi. Chưa biết đọc bao nhiêu file test nữa thì con số đó mới nhúc nhích
- Ranh giới giữa "test hành vi" và "test chi tiết cài đặt" rõ trong ví dụ `reduce` ở
  trên, nhưng ở ca thật thì chưa chắc mình phân biệt được ngay
