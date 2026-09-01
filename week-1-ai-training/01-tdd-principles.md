# Nguyên tắc TDD và vòng Red-Green-Refactor

> **Deliverable 1.** Workflow đã dùng: Layered Questioning, 4 lượt — chi tiết ở
> `ai-workflow-log.md`.

## TDD là gì

TDD là viết test trước rồi mới viết code.

## Vòng Red - Green - Refactor

Viết test xong chạy ngay thì nó đỏ, vì chưa có code.

Rồi viết code cho nó xanh. Chỉ vừa đủ để xanh, không viết thêm.

Rồi refactor, tức là chỉnh lại code cho gọn nhưng không đổi hành vi. Biết refactor không
làm hỏng gì là nhờ kết quả test. Sửa xong chạy lại, vẫn xanh thì không hỏng.

## Vì sao viết test trước

**1. Test phải đỏ một lần thì mới tin được nó.**

Viết test sau thì test xanh ngay từ đầu. Nếu mình viết hỏng cái test, ví dụ quên dòng
`expect`, thì nó cũng xanh. Mà xanh giả trông y hệt xanh thật, mình không phát hiện được.

Viết test trước thì mình thấy nó đỏ trước đã. Nó đỏ được nghĩa là nó thật sự bắt được
cái nó nói là bắt.

**2. Viết test trước thì mình quyết hình dạng hàm sẽ thế nào.**

Viết test sau thì test phải chấp nhận hàm đang có, kể cả khi hàm đó khó test. Viết
test trước thì mình viết cách gọi hàm trước, thấy khó gọi thì sửa ngay, vì code chưa
tồn tại nên sửa không mất gì.

## "Viết test sau cũng được, miễn cuối cùng đủ test và đều xanh"

"Đủ test và đều xanh" chưa chắc là đủ. Xanh mà chưa đỏ lần nào thì không chứng minh
được gì. Nó có thể xanh vì test hỏng chứ không phải vì code đúng.

## Khi nào TDD không hợp

Lúc đang mò thử một thư viện mới, chưa biết nó chạy ra sao, gõ đại vài dòng xem trả về
gì rồi xoá đi. Lúc đó viết test trước không hợp, vì mình chưa biết mình muốn gì.
Chưa biết muốn gì thì không viết ra được cái test mô tả nó.

## Mình kiểm chứng bằng cách nào

| Khẳng định | Kiểm bằng cách nào |
|---|---|
| Test xanh không có nghĩa là code đúng | Đổi `return { title }` thành `return { title: title.trim() }` — hành vi đã khác mà 3/3 test vẫn xanh |
| Test thứ hai là thứ buộc code tổng quát hoá | Với `if (title === '')`, thêm test truyền `'   '` thì đỏ; sửa thành `title.trim() === ''` mới xanh |
| `toThrow('chuỗi')` khớp theo substring | Đọc docs Jest chính thức, mục `.toThrow(error?)` |

Code của hai dòng đầu ở `experiments/tdd-loop/`.

## Còn chưa chắc

- Có nghiên cứu so sánh TDD với "viết code từng mẩu nhỏ rồi test ngay sau", và kết quả
  không rõ ràng. AI dẫn tên nghiên cứu từ trí nhớ, mình chưa tra được nguồn nên không
  đưa vào phần chính
- Mình mới đi vòng Red-Green-Refactor trên một hàm nhỏ. Chưa biết nó còn dễ giữ nhịp
  không khi làm cả CLI ở tuần 2
