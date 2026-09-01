# Bài chạy tay: vòng Red - Green - Refactor

Mất khoảng 3 phút. Mỗi bước chỉ cần sửa một dòng rồi chạy lại một lệnh.

Lệnh chạy test (dùng trong mọi bước):

```
node --test ticket.test.js
```

---

## Bước 1 — thấy màu ĐỎ

Mở `ticket.js`. Đổi dòng `return` thành:

```js
return { title: title };
```

(bỏ mất `status`)

Chạy test. **Kết quả phải là: 1 fail, 2 pass.**

Test 1 đỏ vì `t.status` giờ là `undefined` chứ không phải `'open'`.

> Đây là bước **Red**. Ghi nhớ: test đỏ được nghĩa là nó thật sự đang kiểm cái gì đó.

## Bước 2 — làm cho XANH

Trả `ticket.js` về như cũ:

```js
return { title: title, status: 'open' };
```

Chạy lại. **Phải là: 3 pass, 0 fail.**

> Đây là bước **Green**.

## Bước 3 — thử phá code xem test có bắt được không

Đổi dòng kiểm tra title thành:

```js
if (title === '') throw new Error('title không được rỗng');
```

(bỏ `.trim()`)

Chạy lại. **Phải là: 1 fail, 2 pass** — test 3 đỏ, vì `'   '` không bằng `''`.

> Test 3 chính là thứ buộc code phải xử lý khoảng trắng. Không có nó thì bug này lọt.

## Bước 4 — phép phá quan trọng nhất

Trả `.trim()` về chỗ cũ để 3/3 xanh lại. Rồi đổi dòng `return` thành:

```js
return { title: title.trim(), status: 'open' };
```

Chạy lại. **Kết quả: vẫn 3 pass, 0 fail.**

Nhưng hành vi đã đổi thật: `createTicket('  abc  ')` giờ trả về `'abc'` chứ không phải
`'  abc  '` nữa.

> **Đây là kết luận đáng nhớ nhất của bài này:** test xanh hết không có nghĩa là code
> đúng. Test chỉ bảo vệ đúng những gì nó có khẳng định. Không test nào ở đây nói gì về
> khoảng trắng đầu cuối, nên đổi chỗ đó chẳng test nào biết.

Nhớ trả `ticket.js` về nguyên trạng khi xong.
