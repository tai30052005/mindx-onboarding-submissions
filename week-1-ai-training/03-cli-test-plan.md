# Kế hoạch test cho Ticket Manager CLI

> **Deliverable 3.** Chỉ có đoạn code minh hoạ; project thật làm ở tuần 2.
> File này đồng thời là bản đặc tả dùng cho tuần 2.

Phạm vi lấy từ `docs/plans/week-2/overview.md`: một CLI lưu ticket vào file JSON trên máy,
ticket có các field `title`, `description`, `status`, `priority`, `tags`, và bốn lệnh
`tickets create`, `tickets list`, `tickets show <id>`, `tickets update <id>`.

## Những câu hỏi file này trả lời

- Mỗi lệnh trong bốn lệnh cần test những gì? `[đề bài]`
- Có những luật validate nào, và test từng luật ra sao? `[đề bài]`
- Tầng lưu file JSON được test thế nào? `[đề bài]`
- Ba error case bắt buộc được test thế nào? `[đề bài]`
- Trong số đó, cái nào là unit test và cái nào là integration test? `[thêm]`

## Ba quyết định thiết kế mà kế hoạch này dựa vào

Kế hoạch test không đứng độc lập với thiết kế. Ba điểm dưới đây phải chốt trước, nếu
không thì phân loại unit/integration ở các bảng bên dưới sai hết.

**1. `id` và `createdAt` được tiêm vào, không gọi trực tiếp bên trong hàm.**

```ts
type Deps = { now: () => Date; generateId: () => string };
createTicket(input: CreateTicketInput, deps: Deps): Ticket
```

Nếu hàm tự gọi `randomUUID()` và `new Date()` thì từ bên ngoài không có cách nào assert
giá trị chính xác, chỉ còn `expect(t.id).toBeDefined()` — đúng loại weak assertion liệt kê
ở `05-common-mistakes.md`. Tiêm vào thì test khẳng định được `expect(t.id).toBe('T-1')`.
Luận điểm "TDD là hoạt động thiết kế" ở `01` gặp lại ở đây dưới dạng cụ thể.

**2. Hàm xử lý lệnh *trả về* exit code, không tự gọi `process.exit()`.**

`process.exit()` gọi trong test sẽ giết luôn Jest worker và cho output khó đọc. Chỉ
entrypoint mới được `process.exit(run(argv))`. Tương tự, `process.argv` và `console.log`
được truyền vào chứ không đọc/gọi trực tiếp, để test bắt được output.

**3. Mỗi integration test dùng một thư mục tạm riêng.**

Jest chạy nhiều worker song song. Hai file test cùng đọc/ghi một `tickets.json` sẽ cho
test flaky — lúc xanh lúc đỏ mà không do code. Dùng `fs.mkdtemp` cho từng test rồi dọn.

> Cách test tầng lưu trữ — thư mục tạm thật, mock `fs`, hay giấu sau interface với bản
> in-memory — vẫn đang là quyết định mở, sẽ chốt qua Solution Exploration
> (`ai-workflow-log.md`, mục 20/08). Kế hoạch dưới đây viết theo phương án thư mục tạm
> thật, khớp với cách phân loại đã chốt ở `02-testing-levels.md`.

## Luật validate

| Luật | Áp cho | Test thế nào |
|---|---|---|
| `title` bắt buộc, không rỗng và không toàn khoảng trắng | create, update | Unit, truyền `''` và `'   '`, kỳ vọng ném lỗi validate |
| `status` thuộc tập cho phép | create, update | Unit, truyền giá trị ngoài tập, kỳ vọng bị từ chối |
| `priority` thuộc tập cho phép | create, update | Một phần chặn ở compile time nhờ union type; phần từ `argv` là chuỗi nên vẫn cần test thu hẹp kiểu ở biên CLI |
| `tags` là mảng chuỗi, khử trùng lặp | create, update | Unit, truyền `['bug','bug']`, kỳ vọng còn một phần tử |
| `id` phải tồn tại trong kho | show, update | Unit với kho trong bộ nhớ, và Integration với file thật |

## Test case theo từng lệnh

### `tickets create`

| # | Hành vi được test | Tầng | Kết quả mong đợi |
|---|---|---|---|
| 1 | Tạo với `title` hợp lệ | Unit | Ticket có `status = 'open'` |
| 2 | `title` rỗng | Unit | Ném lỗi validate, không tạo gì |
| 3 | `title` toàn khoảng trắng | Unit | Ném lỗi validate — cùng lỗi với ca 2 |
| 4 | Không truyền `priority` | Unit | Nhận giá trị mặc định |
| 5 | `priority` ngoài tập cho phép, đến từ chuỗi `argv` | Unit | Bị từ chối ở biên CLI trước khi vào logic |
| 6 | `tags` có phần tử trùng nhau | Unit | Kết quả đã khử trùng lặp |
| 7 | `id` sinh từ `generateId` được tiêm | Unit | `expect(t.id).toBe('T-1')` — giá trị chính xác, không phải `toBeDefined()` |
| 8 | `createdAt` lấy từ `now` được tiêm | Unit | Bằng đúng mốc thời gian cố định trong test |
| 9 | Tạo xong thì ticket có trong file JSON | Integration | Đọc lại file trong thư mục tạm thấy đúng ticket |
| 10 | Tạo khi `tickets.json` chưa tồn tại | Integration | Tạo file mới, không văng lỗi |

### `tickets list` (kèm lọc theo status / priority / tags)

| # | Hành vi được test | Tầng | Kết quả mong đợi |
|---|---|---|---|
| 1 | Không truyền filter | Unit | Trả về toàn bộ danh sách |
| 2 | Filter theo `status` | Unit | Đúng tập con |
| 3 | Filter theo `priority` | Unit | Đúng tập con |
| 4 | Filter theo một `tag` | Unit | Chỉ ticket có tag đó |
| 5 | Filter theo nhiều `tag` | Unit | Tập giao, không phải tập hợp |
| 6 | Filter không khớp gì | Unit | Mảng rỗng, **không** phải lỗi |
| 7 | Kết hợp `status` và `priority` | Unit | Thoả cả hai điều kiện |
| 8 | Format một dòng output từ một ticket | Unit | Hàm thuần từ dữ liệu ra chuỗi |
| 9 | Đọc từ file thật rồi lọc | Integration | Kết quả giống hệt ca 2 nhưng nguồn là file |
| 10 | Kho rỗng | Integration | Thông báo thân thiện, exit code 0 |

### `tickets show <id>`

| # | Hành vi được test | Tầng | Kết quả mong đợi |
|---|---|---|---|
| 1 | `id` tồn tại, kho trong bộ nhớ | Unit | Trả đúng ticket, đủ 5 field |
| 2 | `id` không tồn tại, kho trong bộ nhớ | Unit | Lỗi "not found", không ném lỗi lạ |
| 3 | Không truyền `id` | Unit | Lỗi validate, khác lỗi "not found" |
| 4 | `id` tồn tại, đọc từ file thật | Integration | Trả đúng ticket |
| 5 | `id` không tồn tại, đọc từ file thật | Integration | Exit code khác 0 kèm thông báo |

### `tickets update <id>`

| # | Hành vi được test | Tầng | Kết quả mong đợi |
|---|---|---|---|
| 1 | Đổi `status` sang giá trị hợp lệ | Unit | Ticket có status mới |
| 2 | Đổi `status` sang giá trị ngoài tập | Unit | Bị từ chối, ticket không đổi |
| 3 | Update `id` không tồn tại | Unit | Lỗi "not found" |
| 4 | Chỉ truyền một field | Unit | Các field khác giữ nguyên |
| 5 | `title` mới rỗng | Unit | Bị từ chối — cùng luật validate với create |
| 6 | Update rồi đọc lại file | Integration | Thay đổi đã được lưu xuống đĩa |
| 7 | Update một ticket không làm hỏng ticket khác | Integration | Các bản ghi còn lại nguyên vẹn |

## Ba error case bắt buộc

`docs/plans/week-2/overview.md` bắt buộc đúng ba ca này:

| Error case | Tạo tình huống trong test bằng cách nào | Hành vi mong đợi |
|---|---|---|
| Invalid input | Gọi `create` với `title = ''`, hoặc `update` với `status` ngoài tập cho phép | Ném lỗi validate có mã riêng; không ghi gì xuống file; exit code khác 0; thông báo nói rõ field nào sai |
| Ticket not found | Gọi `show` hoặc `update` với `id` không có trong kho | Lỗi "not found" — **khác loại** với lỗi validate, để lớp CLI map ra thông báo và exit code khác nhau |
| Missing / corrupted JSON | Thiếu: không tạo file trong thư mục tạm rồi chạy lệnh. Hỏng: ghi `'{ this is not json'` vào `tickets.json` rồi chạy lệnh | Thiếu → coi như kho rỗng hoặc tạo mới theo spec, không văng stack trace. Hỏng → thông báo rõ là file dữ liệu hỏng kèm đường dẫn, exit code khác 0, **không** ghi đè mất dữ liệu người dùng |

Ba loại lỗi này cần ba loại riêng biệt trong code, không dùng chung `Error`. Lý do: assert
theo loại lỗi thì test không vỡ khi sửa câu chữ thông báo. Assert theo nội dung message —
kiểu `toThrow('title không được rỗng')` — là weak assertion, vì `toThrow` khớp theo
substring nên vẫn pass với một lỗi khác miễn message chứa chuỗi đó.

## Đoạn code minh hoạ

Cú pháp Jest, giữ nhất quán toàn tài liệu — không trộn với Vitest.

**Unit test với dependency được tiêm.** Nhờ tiêm `now` và `generateId` mà assert được giá
trị chính xác thay vì `toBeDefined()`:

```ts
import { createTicket } from '../src/domain/ticket';

const deps = {
  now: () => new Date('2026-08-20T10:00:00.000Z'),
  generateId: () => 'T-1',
};

describe('createTicket', () => {
  it('gán status mặc định là open', () => {
    const t = createTicket({ title: 'Fix login bug' }, deps);
    expect(t.status).toBe('open');
  });

  it('sinh id từ generateId được tiêm', () => {
    const t = createTicket({ title: 'Fix login bug' }, deps);
    expect(t.id).toBe('T-1');
  });

  it('từ chối title chỉ có khoảng trắng', () => {
    expect(() => createTicket({ title: '   ' }, deps)).toThrow(ValidationError);
  });
});
```

Chú ý ca thứ ba: assert theo **loại lỗi** `ValidationError`, không theo nội dung message.

**Integration test với thư mục tạm riêng.** Mỗi test tự tạo và tự dọn, nên chạy song song
không tranh nhau file:

```ts
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { JsonTicketStore } from '../src/storage/json-store';

describe('JsonTicketStore', () => {
  let dir: string;

  beforeEach(() => { dir = mkdtempSync(join(tmpdir(), 'tickets-')); });
  afterEach(() => { rmSync(dir, { recursive: true, force: true }); });

  it('ghi rồi đọc lại ra đúng ticket', async () => {
    const store = new JsonTicketStore(join(dir, 'tickets.json'));
    await store.save([{ id: 'T-1', title: 'Fix login bug', status: 'open' }]);
    const loaded = await store.load();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].id).toBe('T-1');
  });

  it('báo lỗi rõ khi file JSON hỏng, không ghi đè dữ liệu', async () => {
    const file = join(dir, 'tickets.json');
    writeFileSync(file, '{ this is not json');
    const store = new JsonTicketStore(file);
    await expect(store.load()).rejects.toThrow(CorruptedStoreError);
  });
});
```

Chú ý ca thứ hai dùng `await expect(...).rejects.toThrow(...)`, và `it` phải là `async`.
Đây là chỗ mình đã chạy thử thật với Jest 30 trên Node 24 thay vì tin lời AI:

| Cách viết | Kết quả thật |
|---|---|
| `expect(() => load()).toThrow()` | Không pass, cũng không đỏ bình thường — promise bị reject không ai bắt, **worker chết** kèm stack trace không chỉ vào test nào |
| `expect(load()).rejects.toThrow(...)` thiếu `await` | Assertion chạy sau khi test đã kết thúc; cũng làm chết worker |
| `await expect(load()).rejects.toThrow('file hong')` | Pass đúng |
| `await expect(load()).rejects.toThrow('thông báo khác')` | Đỏ đúng cách, có diff đọc được |

Chi tiết ở `ai-workflow-log.md` Part 3. Điều này còn quan trọng hơn ở tuần 3, khi mọi lời
gọi HTTP đều là async.

## Mình kiểm chứng bằng cách nào

| Khẳng định | Kiểm bằng cách nào |
|---|---|
| Phạm vi 4 lệnh, 5 field và 3 error case là đúng đề bài | Đối chiếu từng dòng với `docs/plans/week-2/overview.md`, không lấy phạm vi từ AI |
| Phân loại unit/integration ở đây nhất quán với `02` | Áp cùng một trục: biên ngoài tiến trình. Các ca dùng kho trong bộ nhớ là unit kể cả khi về chủ đề là "CLI command behavior" |
| `toThrow('chuỗi')` khớp theo substring nên là weak assertion | Đọc docs Jest chính thức, mục `.toThrow(error?)` |
| Thư mục tạm riêng cho mỗi test là cần thiết, không phải cẩn thận thừa | Jest mặc định chạy nhiều worker song song; hai file test dùng chung một đường dẫn sẽ tranh nhau |

## Còn chưa chắc

- Ca `update` không truyền field nào: nên từ chối như invalid input, hay coi là no-op và
  trả 0? Đề bài không nói. Cần chốt trước khi viết test, vì đây là quyết định về đặc tả
  chứ không phải về code
- Thiếu file `tickets.json` nên tự tạo mới hay báo lỗi. Đề bài xếp nó chung nhóm với
  "corrupted", nhưng hai tình huống này khác nhau: thiếu file là trạng thái bình thường
  lần chạy đầu, còn file hỏng là bất thường
- Cách test tầng lưu trữ vẫn chưa chốt — xem Solution Exploration trong
  `ai-workflow-log.md`. Nếu chọn phương án giấu sau interface thì một số ca ở cột
  Integration sẽ chuyển thành Unit
- Chưa rõ `id` nên sinh tuần tự (`T-1`, `T-2`) hay UUID. Tuần tự thì dễ gõ tay khi dùng
  `show <id>`, nhưng phải đọc toàn bộ file mới biết số kế tiếp
