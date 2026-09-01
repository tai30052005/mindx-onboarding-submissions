# Test kiểm soát code do AI sinh ra bằng cách nào

> **Deliverable 4.**

## Vì sao không để AI viết cả test lẫn code

Xanh hết không có nghĩa là code đúng.

Lúc AI viết test, nó nhìn thấy cái code nó vừa viết. Nên test đó mô tả cái code đang
làm, không phải cái đáng lẽ code phải làm. Code sai thì test cũng sai theo, mà vẫn xanh.

Thêm nữa là code đó chưa đỏ bao giờ, nên không biết test có bắt được gì không.

## Cách mình làm thay vào đó

Mình viết test, AI viết code cho test đó xanh.

Làm vậy thì AI không sửa được test cho khớp với code của nó, vì test viết từ trước rồi.
Và mình thấy test đỏ trước khi AI đụng vào, nên biết test đó bắt được thật.

Đây cũng là phương án mình chọn sau buổi Solution Exploration, ghi ở `ai-workflow-log.md`.

## Xanh rồi vẫn phải soát

Test của mình kiểm 3 trường hợp, AI làm xanh cả 3. Nhưng trường hợp thứ 4 mình quên chưa
test thì không chắc code chạy đúng ở đó.

Xanh chỉ chứng minh đúng ở những chỗ có test. Chỗ không có test thì xanh không nói gì.

Nên nhận code của AI thì mình đọc code trước, thấy chỗ nào test chưa phủ thì viết thêm
test cho chỗ đó.

## Mình kiểm chứng bằng cách nào

| Khẳng định | Kiểm bằng cách nào |
|---|---|
| Test xanh không chứng minh code đúng | Tự sửa `return { title }` thành `return { title: title.trim() }`: hành vi đã đổi mà 3/3 test vẫn xanh |
| Lập luận nghe hợp lý vẫn có thể sai về số | Viết `experiments/speed/bench.test.js` đo unit và integration trong cùng một lần chạy, rồi sửa lại kết luận trong `02` theo số đo |

## Còn chưa chắc

- **"Đọc code trước khi nhận" chỉ chạy được tới mức mình đọc ra.** Đây là chỗ hở lớn
  nhất của file này. Mở một file code mình không viết ra đọc, nếu trong đó có lỗi thì
  mình không chắc phát hiện được. Nói cách khác, cái chốt chặn mình viết trong phần chính
  lại giả định sẵn một kỹ năng mà mình chưa có.

  Cái vẫn dùng được khi đọc không ra: **chạy thật, rồi phá thử.** Sửa một dòng cho sai
  đi, chạy test, xem có đỏ không. Không đỏ nghĩa là test không canh chỗ đó, bất kể mình
  có hiểu code hay không. Đó đúng là cách mình bắt được vụ `title.trim()` trong
  `experiments/tdd-loop/`: đổi một dòng, hành vi khác hẳn, 3/3 test vẫn xanh. Lúc đó mình
  chưa hiểu gì về đoạn code đó cả.

  Nên thứ tự đúng chắc là **chạy và phá trước, đọc code sau**, ngược với thứ tự mình
  viết ở phần chính. Chưa sửa lại phần chính vì chưa làm đủ nhiều để chắc.

- Mình mới phá code bằng tay hai ba chỗ để thử xem test có bắt không. Chưa dùng công cụ
  tự động (Stryker), nên chưa biết cách làm thủ công này đủ hay không
