# Những lỗi test thường gặp và cách tránh

> **Deliverable 5.** Workflow đã dùng: Iterative Refinement.
>
> Bốn lỗi dưới đây là bốn lỗi đề bài nêu trong `docs/plans/week-1/overview.md`.
> Ví dụ trong file này lấy từ buổi refinement thật của mình, ghi ở `ai-workflow-log.md`
> mục 20/08. Phần cái gì mình tự tìm ra và cái gì phải được chỉ thì ghi trung
> thực ở cuối file.

## Những câu hỏi file này trả lời

- Bốn lỗi đó là gì, và trong code test thật chúng trông ra sao? `[đề bài]`
- Mỗi lỗi có hại thế nào, về sau phải trả giá gì? `[thêm]`
- Phát hiện và tránh từng lỗi bằng cách nào? `[đề bài]`

## 1. Test thừa (over-testing)

**Trông như thế nào**

```ts
it('title được lưu đúng', () => {
  const t = createTicket({ title: 'Fix login bug' });
  expect(t.title).toBe('Fix login bug');
});
```

Với implementation là `return { title, ... }`, test này đang kiểm tra **phép gán của
JavaScript**, không kiểm tra logic nào của mình.

**Tác hại**

Nó không bao giờ đỏ vì một lý do có ý nghĩa — nếu phép gán hỏng thì đã không có gì chạy
được. Nhưng nó vẫn tính vào con số test và vào coverage, nên tạo cảm giác được bảo vệ
nhiều hơn thực tế. Và nó vẫn phải bảo trì: đổi tên field là phải sửa nó.

**Cách tránh**

Phép thử: **cố tình phá code, xem test có đỏ không.** Không nghĩ ra được cách phá nào làm
test này đỏ mà không phá luôn cả chương trình, thì test đó không bảo vệ gì. Hỏi cụ thể hơn:
"quy tắc nào của mình sẽ bị vi phạm nếu test này đỏ?" — không trả lời được thì xoá.

## 2. Assertion yếu (weak assertions)

**Trông như thế nào**

```ts
// trước
it('tạo được ticket', () => {
  const t = createTicket({ title: 'Fix login bug' });
  expect(t).toBeDefined();
  expect(t.id).toBeTruthy();
});

// sau
it('gán status mặc định là open', () => {
  const t = createTicket({ title: 'Fix login bug' }, deps);
  expect(t.status).toBe('open');
});

it('sinh id từ generateId được tiêm', () => {
  const t = createTicket({ title: 'Fix login bug' }, deps);
  expect(t.id).toBe('T-1');
});
```

`toBeDefined()` luôn đúng trừ khi hàm trả `undefined`. `toBeTruthy()` pass với `'x'`,
`'-'`, `1` — `id` sinh sai định dạng vẫn xanh.

Một dạng khác cùng loại:

```ts
expect(() => createTicket({ title: '' })).toThrow('rỗng');   // trước
expect(() => createTicket({ title: '' }, deps)).toThrow(ValidationError);   // sau
```

`toThrow('chuỗi')` khớp theo **substring**, nên bất kỳ Error nào chứa chữ "rỗng" cũng pass
— kể cả một lỗi hoàn toàn khác.

**Tác hại**

Test kiểu này trông y hệt test có ích trong báo cáo coverage, nhưng không phân biệt được
code đúng với code sai. Và vì hành vi đó đã "có test" rồi, khả năng có ai quay lại viết
một test thật cho nó là rất thấp.

Đây thường **không phải sơ suất ngẫu nhiên** mà là chỗ người viết test bỏ cuộc: gặp `id`
và `createdAt` sinh ngầm bên trong hàm, không assert được giá trị chính xác, nên hạ xuống
`toBeDefined()` cho xong.

Nhưng nói rằng test-last **bị ép** dùng assert yếu là sai — mình đã kiểm bằng cách chạy
thật (`experiments/async-check/faketimer.test.js`, 3/3 pass, không tiêm gì cả):
`jest.useFakeTimers()` + `setSystemTime()` khoá được `createdAt` về giá trị chính xác, và
`id` ngẫu nhiên assert được bằng định dạng cộng tính duy nhất giữa hai lần gọi. Đường vòng
có tồn tại; nó chỉ yếu hơn và phải chủ động nghĩ ra.

**Cách tránh**

Với mỗi assertion, hỏi: **giá trị sai nào vẫn lọt qua được?** Trả lời ra một giá trị cụ
thể là assertion đó còn yếu. Và assert theo **loại lỗi**, không theo nội dung message.

## 3. Test vào chi tiết cài đặt

**Trông như thế nào**

```ts
it('serialize ra đúng định dạng', () => {
  const t = createTicket({ title: 'A' });
  expect(JSON.stringify(t)).toBe('{"id":"T-1","title":"A","status":"open"}');
});
```

So nguyên chuỗi thì test bị buộc vào **thứ tự khoá** trong object. Đổi thứ tự field trong
câu `return` là một refactor thuần, hành vi quan sát được không đổi, mà test vẫn vỡ.

Cùng loại: `toThrow('title không được rỗng')` buộc test vào câu chữ thông báo lỗi.

**Tác hại**

Test đáng lẽ là lưới an toàn cho bước Refactor thì biến thành xiềng xích. Sửa cấu trúc
xong thấy một loạt test đỏ dù không đổi hành vi, và phản xạ tiếp theo là **ngại refactor**
— mất đúng thứ TDD sinh ra để cho.

**Cách tránh**

Test qua **bề mặt công khai**, khẳng định về hành vi chứ không về cách hành vi được tạo ra.
Phép thử: *"nếu mình refactor bên trong mà không đổi hành vi, test này có đỏ không?"* — đỏ
thì nó đang test implementation.

## 4. Tin output của AI mà không kiểm

**Trông như thế nào**

```ts
it('báo lỗi khi file JSON hỏng', () => {
  writeFileSync(STORE_PATH, '{ hong');
  const store = new JsonTicketStore(STORE_PATH);
  expect(() => store.load()).toThrow();
});
```

Đoạn này đọc rất hợp lý và có ba lỗi cùng lúc: `it` không `async` trong khi `load()` là
async; `STORE_PATH` là đường dẫn cố định dùng chung nên Jest chạy song song sẽ tranh nhau;
và ghi file xong không dọn.

**Tác hại**

Cả ba lỗi đều không nhìn thấy được khi đọc. Không lỗi nào sai cú pháp, không lỗi nào sai
logic nếu soi từng dòng. `it` thiếu `async` chỉ lộ khi hàm thật sự được gọi; đường dẫn
dùng chung chỉ lộ khi có worker thứ hai chạy cùng lúc. Đọc kỹ hơn không giúp được gì, vì
vấn đề không nằm ở chỗ đọc chưa kỹ.

Lý do code AI né được phản xạ đọc-thấy-ổn thì mình viết ở `04-ai-validation.md`, mục
"Test là đặc tả chạy được". Không chép lại ở đây.

**Cách tránh**

Quy trình đầy đủ cũng nằm ở `04`, mục "Quy trình mình soát trước khi nhận output của AI". Riêng với nhóm lỗi này thì
chỉ đúng một việc có tác dụng: **chạy nó**. Cả ba lỗi trên đều lộ ngay lần chạy đầu tiên.

Ví dụ thật trong tuần này: AI nói với hàm async thì `expect(() => f()).toThrow()` sẽ "im
lặng pass". Mình cài Jest thật và chạy: nó **không** pass, nhưng cũng **không** đỏ bình
thường — worker chết vì promise bị reject không ai bắt. Rủi ro AI nêu là có thật, nhưng
mô tả triệu chứng thì sai, và chỉ chạy mới biết. Chi tiết ở `ai-workflow-log.md` Part 3.

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
| Mình tự tìm ra trước khi hỏi | 1 / 10 |
| Phải được chỉ ra | 9 / 10 |

Cái tự tìm được: khối `describe('Ticket')` gom cả unit test lẫn test chạm file vào một
chỗ, nên tên khối không nói được nó đang test đơn vị nào.

Nhóm sót nhiều nhất là **weak assertions**. Lúc đọc `toBeTruthy()` mình không thấy có gì
sai, vì chưa có phản xạ hỏi *"khẳng định này vẫn đúng với những giá trị sai nào?"*. Sau
buổi này thì đó thành câu hỏi mình đặt cho từng assertion.

Nhóm sót thứ hai là các lỗi **không nhìn thấy khi đọc**: `it` thiếu `async`, đường dẫn
dùng chung khi chạy song song, thiếu dọn dẹp. Chúng không sai về cú pháp và không sai về
logic khi đọc từng dòng — chỉ sai khi chạy thật trong đúng điều kiện.

## Mình kiểm chứng bằng cách nào

| Khẳng định | Kiểm bằng cách nào |
|---|---|
| `toThrow('chuỗi')` khớp theo substring nên là assertion yếu | Đọc docs Jest chính thức, mục `.toThrow(error?)` |
| `expect(() => f()).toThrow()` không dùng được cho hàm async | Cài Jest 30 thật trong `experiments/async-check/`, viết 4 biến thể và chạy: hai biến thể sai làm chết worker, chỉ `await expect(f()).rejects.toThrow(...)` chạy đúng |
| `toBeTruthy()` pass với cả giá trị sai định dạng | Chạy `node -e "console.log(['x','-',1].map(Boolean))"` — cả ba đều `true`, nên một `id` rỗng ký tự hay sai tiền tố vẫn lọt |
| Đường dẫn file dùng chung gây flaky | Jest mặc định chạy nhiều worker song song; hai file test cùng ghi một đường dẫn sẽ tranh nhau |

## Còn chưa chắc

- Ranh giới giữa over-testing và test-phòng-hồi-quy chưa rõ. `expect(t.title).toBe(...)`
  hôm nay là thừa, nhưng khi `title` bắt đầu bị chuẩn hoá — cắt khoảng trắng, giới hạn độ
  dài — thì nó thành test thật. Chưa biết dựa vào đâu để quyết ở thời điểm viết
- Chưa sửa hết file bài tập: còn 4 test đánh dấu `TODO`. Để nguyên có chủ đích, làm mốc
  đối chiếu khi quay lại ở tuần 2
- Trong 9 lỗi mình không tự thấy, chưa rõ một công cụ mutation testing sẽ bắt hộ được bao
  nhiêu. Đoán là bắt được nhóm weak assertion và bỏ qua nhóm `async` thiếu / thư mục dùng
  chung, vì hai nhóm sau không phải lỗi về assertion. Chưa kiểm nên vẫn là đoán
