# Solution Exploration — ranh giới dùng AI khi code tuần 2

> Chép nguyên văn phiên AI mới, mở riêng cho workflow này. Không sửa, không cắt.
> Tương ứng mục **Solution Exploration** trong `../ai-workflow-log.md`.
>
> Câu hỏi đem ra khai thác là câu số 4 trong sổ câu hỏi của mình, đang để trạng thái
> chưa quyết: *"ranh giới dùng AI khi code tuần 2 — AI viết implementation rồi mình
> review, hay tự viết?"*
>
> **Trạng thái:** bước 1–2 đã chạy. Bước 3–5 chưa, sẽ bổ sung vào chính file này.

---

## Bước 1 — nêu bối cảnh, chưa hỏi phương án

**Mình hỏi:**

```
Tuần sau tôi phải build một CLI quản lý ticket bằng TypeScript + Jest,
làm theo TDD. Bối cảnh:

- Tôi là intern, chưa từng viết unit test trước tuần này
- Làm một mình, có 1 tuần
- Tuần kế tiếp phải cắm thêm một HTTP client vào chính codebase đó
- Chương trình đào tạo này chấm cả "cách dùng AI", không chỉ chấm code chạy được
- Tiêu chí có ghi: "you are the architect" — tôi phải là người quyết

Chưa cần bạn đề xuất gì. Trước hết hãy nói: trong bối cảnh này, việc
quyết định "dùng AI tới đâu khi viết code" có những vấn đề gì phải cân,
mà người mới như tôi dễ không nhìn ra?
```

**AI trả lời:**

Dưới đây là những chỗ căng thật sự trong quyết định đó — không phải lời khuyên, chỉ là các mặt phải cân.

**1. "Dùng AI tới đâu" không phải một cái núm duy nhất**

Người mới thường đặt một mức chung cho cả dự án. Nhưng chi phí/lợi ích khác nhau rất xa giữa các loại việc: `tsconfig.json`, `jest.config`, cấu trúc thư mục, parse argv — AI viết hộ gần như không mất gì. Còn viết test đầu tiên, hay chọn ranh giới module — mất rất nhiều. Cùng một mức "70% AI" áp cho cả hai là vừa lãng phí vừa nguy hiểm.

Núm đó còn phải đổi theo thời gian: mức an toàn của bạn ngày 1 và ngày 5 khác nhau, vì đến ngày 5 bạn đã đọc được test rồi.

**2. TDD và AI đẩy nhau theo hai hướng ngược**

Ba va chạm cụ thể, không hiển nhiên:

- Test viết bởi AI cùng lúc với code viết bởi AI có xu hướng đồng lõa. Test được sinh ra để khớp với implementation đó, nên nó pass — kể cả khi implementation sai. Bạn có màu xanh mà không có thông tin. Người chưa từng viết test rất khó nhìn ra một test "pass vì lý do sai".
- Design-by-autocomplete. Trong TDD, cái test đỏ chính là bản thiết kế: nó chốt tên hàm, chữ ký, ai gọi ai. Nhờ AI viết test tức là đã giao luôn phần thiết kế, chỉ là nó không trông giống một quyết định thiết kế.
- AI có xu hướng đi bước to. TDD sống bằng bước nhỏ, và giai đoạn refactor mới là chỗ kiến trúc thực sự hình thành. Mỗi lần AI sinh nguyên một file là nuốt mất vài vòng red-green-refactor — bạn có code, nhưng không đi qua chỗ mà bài học nằm ở đó.

**3. Trần thẩm định**

Bạn chỉ nên nhận output AI tới mức bạn còn đủ sức phát hiện nó sai. Với code CLI thường thì trần này của bạn khá cao (chạy thử là biết). Với test thì tuần này trần của bạn gần bằng 0: bạn chưa phân biệt được test không có assertion, test mock đúng cái đang cần kiểm, test chỉ khẳng định lại implementation. "Review kỹ output của AI" là một câu vô nghĩa ở vùng mình chưa có nghề — và đó đúng là vùng trung tâm của tuần này.

**4. Quyết định vô hình mới là chỗ mất quyền "architect"**

Nguy hiểm không nằm ở những chỗ bạn hỏi AI "chọn A hay B", mà ở những chỗ AI chốt mà bạn không kịp nhận ra là có một lựa chọn. Trong một ticket CLI, ít nhất: lưu ở đâu (memory / file JSON / sqlite), báo lỗi bằng exception hay bằng giá trị trả về, API đồng bộ hay bất đồng bộ, ai sinh ID, thời gian lưu kiểu gì, logic nghiệp vụ có chạm trực tiếp `fs` không, tầng CLI có biết gì về tầng lưu trữ không.

AI sẽ chọn hết, im lặng, và chọn hợp lý — đó là lý do bạn không thấy. Đến buổi review, câu hỏi sẽ không phải "cái này làm gì" mà "sao không phải cách kia". Không trả lời được nghĩa là không phải bạn quyết, dù code chạy tốt.

**5. Tuần 2 là bài kiểm tra của tuần 1 — nhưng đừng lật ngược thành cớ**

Cắm HTTP client vào không phải việc mới; nó là cái que thăm dò xem các đường nối (seam) tuần 1 có thật không. Hai chỗ đau điển hình: (a) nếu core logic gọi thẳng I/O, tuần 2 bạn phải mổ khắp nơi; (b) nếu tuần 1 hoàn toàn đồng bộ, HTTP kéo `async` lan ngược lên toàn bộ chữ ký hàm và toàn bộ test — sửa muộn thì đắt gấp nhiều lần. AI viết code chạy được sẽ không tự nêu chuyện này, vì đường ngắn nhất tới "chạy được" là nối thẳng.

Mặt còn lại của cùng đồng xu: biết trước tuần 2 rất dễ dẫn tới trừu tượng hóa sớm — plugin, adapter, dependency injection cho một CLI một người dùng trong một tuần. Cái đó cũng bị trừ điểm, và cũng khó bảo vệ, vì yêu cầu thật tuần 2 gần như chắc chắn không khớp với cái bạn đoán.

Thứ đáng cân là chi phí đảo ngược: đổi tên biến thì miễn phí, đổi sync→async sau khi đã có 40 test thì không. Núm AI nên chặt hơn ở đúng những chỗ khó đảo.

**6. Chi phí trả sau, không trả ngay**

Code AI viết mà bạn không hiểu vẫn ổn — cho tới khi nó hỏng. Lúc đó là ngày thứ 5, một mình, không ai hỏi, và bạn debug một hệ thống mà bạn chưa từng xây trong đầu. Tốc độ ngày 1–2 không suy ra được tốc độ cả tuần. Người mới hầu như luôn ngoại suy sai chỗ này.

Liên quan: nút thắt thật của bạn tuần này là hiểu, không phải gõ. AI cắt thời gian gõ — tức là cắt đúng phần rẻ nhất.

**7. Chiều thứ hai của "dùng AI" mà người mới hay bỏ quên**

Bạn đang mặc định "dùng AI" = "AI sinh code". Còn một chế độ khác: giải thích, phản biện, review, hỏi "chỗ này có quyết định ẩn nào không", "test này pass vì lý do gì". Chế độ đó gần như không có mặt trái với việc học, lại nhắm đúng nút thắt ở mục 6, và nó là chỗ bạn vẫn giữ được vai architect. Nếu bạn cân "dùng nhiều hay ít" trên một trục duy nhất, bạn sẽ không thấy chiều này tồn tại.

**8. Cái đang bị chấm có lẽ là dấu vết, không phải tỷ lệ**

"Chấm cách dùng AI" gần như chắc không có nghĩa là dùng nhiều thì tốt, hay dùng ít thì tốt. Nó nhắm vào phán đoán: chỗ nào bạn dùng, chỗ nào không, vì sao, và bạn kiểm chứng output bằng cách nào. Hệ quả thực tế mà người mới hay vấp: dấu vết đó phải sinh ra trong lúc làm (commit history, ghi chú ngắn khi ra quyết định). Dựng lại vào tối Chủ nhật thì vừa rất khó, vừa hơi giống bịa.

**9. Ẩn số thật: chuẩn mực của chương trình**

"You are the architect" không nói cho bạn biết họ chấp nhận mức nào. Đây là thứ duy nhất trong danh sách này bạn không suy ra được bằng lý lẽ — và cũng là thứ rẻ nhất để hỏi mentor một câu, thay vì đoán suốt một tuần.

Cân được rồi thì các lựa chọn sẽ tự hiện ra; tôi chưa đề xuất gì. Khi nào bạn muốn, tôi có thể đi tiếp theo hướng bạn chọn — ví dụ soi kỹ mục 4 (danh sách quyết định phải tự chốt trước khi gõ dòng đầu) hoặc mục 5 (những gì tuần 2 sẽ bẻ gãy).

---

## Bước 2 — khai thác phương án kèm ưu nhược

**Mình hỏi:**

```
Giờ liệt kê các phương án khả dĩ cho ranh giới đó. Với mỗi phương án:

1. Mô tả cụ thể ai viết gì (test, implementation, refactor)
2. Ưu điểm — nói rõ nó được cái gì
3. Nhược điểm — nói rõ nó mất cái gì, và mất ở thời điểm nào
4. Nó hỏng rõ nhất trong tình huống nào

Đừng xếp hạng, đừng khuyên tôi chọn cái nào. Tôi cần bảng để tự cân.
Ít nhất 3 phương án.
```

**AI trả lời:**

Bảy phương án. Ba trục khác nhau: A/B/D/G chia theo pha (ai làm red, ai làm green), E chia theo vùng code, F chia theo thời gian. Nên chúng không loại trừ nhau hoàn toàn — ghi chú ở cuối.

### PA A — Bạn viết test, AI viết implementation, bạn refactor

**1. Ai viết gì.** Test: bạn 100%, kể cả cái đầu tiên viết xấu. Impl: AI, mỗi lần đúng một test đỏ, với ràng buộc "làm test này pass, không sửa test, không thêm tính năng". Refactor: bạn chọn hình dạng; AI có thể thực thi thao tác cơ học (đổi tên, tách file).

**2. Được.** Giữ nguyên cơ chế học chính của tuần — viết test là tự tay đặt spec. Chữ ký hàm, tên module, kiểu trả về đều do bạn chốt trước khi AI nhìn thấy code, nên "you are the architect" có bằng chứng vật lý trong git history (commit test đứng trước commit impl). Test không đồng lõa với impl vì nó ra đời trước. Và phần lớn thời gian gõ nằm ở impl — đúng phần AI cắt được.

**3. Mất, mất lúc nào.** Mất sự thông thuộc bên trong impl. Chi phí không rơi lúc viết mà rơi lúc sửa: ngày 5 khi debug, và tuần 2 khi cắm HTTP client vào một hàm bạn chưa từng đọc kỹ. Nguy hiểm hơn: nếu test bạn viết yếu — rất có thể, tuần đầu — AI sẽ viết impl vừa đủ pass cái test yếu đó. Bug lọt qua trong khi màn hình vẫn xanh; mất ở lúc demo hoặc lúc grader thử input lạ. Ngoài ra mỗi vòng prompt–review có overhead, nên ngày 1–2 chậm hơn bạn tưởng.

**4. Hỏng rõ nhất khi.** Khi bạn chưa biết mình muốn test gì. Phương án này giả định bạn nghĩ ra được test case — mà ngày 1, với người chưa từng viết test, màn hình trắng ở bước red chính là chỗ tắc, và AI đứng chờ ở bước green không gỡ được. Hỏng lần hai khi test của bạn bám sát nội tại (gọi thẳng thuộc tính private, khẳng định cấu trúc dữ liệu bên trong): AI viết impl khớp y hệt, và mọi refactor sau đó làm vỡ hàng loạt test.

### PA B — AI viết test, bạn viết implementation

**1. Ai viết gì.** Test: AI sinh cả file, kèm theo chữ ký hàm/lớp mà nó tự giả định. Impl: bạn, tự tay làm cho xanh. Refactor: bạn, nhưng bị ràng buộc bởi test AI viết.

**2. Được.** Bạn được nhìn test tốt trước khi phải tự viết — cách học đọc test nhanh nhất khi đang ở số 0. Lấy được các edge case người mới không nghĩ ra: id trùng, list rỗng, close ticket không tồn tại, title toàn khoảng trắng, sort không ổn định. Và bạn vẫn viết code, nên vẫn giữ cảm giác codebase — có lợi cho tuần 2.

**3. Mất, mất lúc nào.** Mất quyền thiết kế, một cách vô hình và ngay lập tức: `store.add({title})` trả về ticket hay id, ném exception hay trả Result, sync hay async — AI vừa chốt tất cả trong file test, mà test là thứ đắt nhất để đổi về sau. Mất từ ngày 1, phát hiện ở tuần 2. Mất luôn kỹ năng đang bị chấm: hết tuần bạn chưa từng tự nghĩ ra một test case nào từ con số không. Ở buổi review, câu "sao anh test cái này mà không test cái kia" không có đường trả lời.

**4. Hỏng rõ nhất khi.** Khi tiêu chí "you are the architect" được kiểm bằng cách hỏi về API surface — vì toàn bộ API surface nằm trong file bạn không viết. Và khi tuần 2 cần async: test AI viết tuần 1 gần như chắc chắn đồng bộ, nên bạn phải sửa vài chục test cùng lúc với việc lần đầu học async trong Jest.

### PA C — Tự viết hết; AI chỉ giải thích và phản biện, không dán một dòng code nào

**1. Ai viết gì.** Test, impl, refactor: bạn 100%. AI chỉ trả lời: "test này pass vì lý do gì", "trong diff này có quyết định ẩn nào tôi không nhận ra", "chỗ nào tuần sau tôi sẽ hối hận", giải thích lỗi type, giải thích `beforeEach` khác `beforeAll` ở đâu.

**2. Được.** Kỹ năng nằm lại trong người chứ không chỉ trong repo — hết tuần bạn thực sự biết viết test. Mọi quyết định là của bạn theo nghĩa mạnh nhất, không chỗ nào phải phân trần. Tuần 2 rẻ nhất vì bạn thuộc từng đường nối. Và chế độ giải thích không bị chặn bởi trần thẩm định: hiểu sai thì test đỏ, bạn biết ngay.

**3. Mất, mất lúc nào.** Mất thông lượng, và mất ở ngày 6–7 khi nhìn lại thấy CLI mỏng hơn dự tính — ít lệnh hơn, ít edge case hơn. Mất các trường hợp biên mà bạn chưa đủ kinh nghiệm để tưởng tượng, vì không ai nhắc. Đốt thời gian vào thứ không được chấm: tsconfig, ts-jest, ESM, boilerplate — mất ngay ngày 1. Và có rủi ro bị đọc là "không phối hợp được với AI" nếu tiêu chí thực sự muốn thấy điều đó; cái mất này đến từ hiểu sai chuẩn mực chứ không phải từ kỹ thuật.

**4. Hỏng rõ nhất khi.** Khi bạn tắc ở một thứ hoàn toàn ngoài lề — cấu hình Jest + ESM + TypeScript sai — và tự dò sáu tiếng. Sáu tiếng đó không sinh ra kỹ năng nào đang được chấm, mà bạn chỉ có bảy ngày. Hỏng lần hai nếu chương trình đo "cách dùng AI" theo nghĩa có phối hợp thật: bạn nộp một quá trình gần như không có gì để nói về AI.

### PA D — AI viết test + impl + refactor; bạn làm architect qua đặc tả và review

**1. Ai viết gì.** Bạn: viết spec trước bằng chữ (module nào, ranh giới nào, lỗi kiểu gì, sync hay async, lưu ở đâu), liệt kê test case bằng ngôn ngữ tự nhiên, rồi review và bác bỏ. AI: dịch từng case thành file test, viết impl, đề xuất refactor. Bạn: chốt nhận hay yêu cầu sửa.

**2. Được.** Thông lượng cao nhất — bảy ngày có thể ra CLI đủ lệnh, coverage cao, có `--json`, có error handling tử tế. Nếu bạn thật sự viết spec trước bằng chữ thì bạn thật sự là architect, và có tài liệu đề ngày trước commit đầu tiên để chứng minh. Cơ học chuẩn bị cho tuần 2 cũng dễ nhất, vì bạn chỉ cần yêu cầu "tách interface cho storage" là có.

**3. Mất, mất lúc nào.** Mất trần thẩm định — bạn duyệt test mà chưa đủ nghề để thấy test không có assertion, test tautological, mock trùm lên chính thứ đang kiểm. Cái mất này xảy ra từ ngày 1 nhưng chỉ lộ ra khi có bug thật hoặc khi grader mở file test. Mất bài học TDD: bạn không đi qua vòng red-green-refactor lần nào; repo trông giống TDD nhưng quá trình thì không — mất đúng vào mục tiêu đào tạo. Mất khả năng debug, và trả đúng lúc tệ nhất: ngày 5, bug nằm ở chỗ giao giữa hai module do AI viết, bạn không có mô hình trong đầu để lần.

**4. Hỏng rõ nhất khi.** Khi có bug mà test vẫn xanh. Cả test lẫn code đều không phải của bạn, nên đường duy nhất là nhờ AI sửa — và bạn rơi vào vòng sửa-cái-này-hỏng-cái-kia mà không có điểm tựa nào để thoát. Hỏng lần hai khi grader mở một file test bất kỳ và hỏi: "cái test này bảo vệ mình khỏi lỗi gì?"

### PA E — Chia theo vùng code: lõi tự viết, rìa giao AI

**1. Ai viết gì.** Vùng lõi (model ticket, store, các phép add/list/close/filter) — bạn viết cả test lẫn impl, theo TDD tay. Vùng rìa (tsconfig, jest.config, parse argv, format bảng ra terminal, exit code, help text, fixture factory) — AI viết. Refactor: bạn ở lõi, tuỳ ở rìa.

**2. Được.** Đặt công sức học vào đúng chỗ có giá trị học, và đặt AI vào chỗ không dạy bạn gì (không ai học được gì từ lần đầu gõ yargs). Có tác dụng phụ tốt: vì phải nói được "cái này AI làm, cái kia tôi làm", bạn buộc phải vạch ranh giới lõi/I-O rõ ràng — gián tiếp chuẩn bị cho tuần 2. Câu chuyện kể ở review cũng sạch: đây là ranh giới, đây là lý do.

**3. Mất, mất lúc nào.** Mất vì đường biên không sạch như lý thuyết: format output có logic nghiệp vụ lẫn vào (thứ tự, cắt chữ, đánh dấu quá hạn). Bạn phải phân xử "lõi hay rìa" mỗi ngày, và đôi khi phân sai. Mất một cách hơi mỉa mai ở tuần 2: HTTP client là I/O, tức là vùng rìa, tức là vùng bạn đã giao AI và không thuộc. Và test cho vùng rìa hoặc không có, hoặc do AI viết — coverage không đồng đều, dễ bị hỏi đúng chỗ mỏng.

**4. Hỏng rõ nhất khi.** Khi hoá ra "rìa" mới là phần lớn công việc thật. Với một ticket CLI, lõi có thể chỉ khoảng 150 dòng, còn thứ người ta demo và bấm thử thì nằm hết ở vỏ. Bạn tự viết 150 dòng trong bảy ngày rồi giao phần còn lại — phần được nhìn. Hỏng lần hai khi ranh giới vạch ngày 1 sai, tới ngày 4 mới thấy: giờ phải kéo code từ vùng AI về vùng mình, và nó không có test.

### PA F — Chia theo thời gian: lát cắt đầu tự viết hết, rồi nâng mức AI

**1. Ai viết gì.** Ngày 1–2: một lát cắt dọc duy nhất (ví dụ add + list) — bạn viết test, impl, refactor, 100% tay, đúng nhịp TDD; AI chỉ ở chế độ giải thích. Từ ngày 3: mẫu đã có, các lệnh còn lại chạy ở mức cao hơn (bạn viết test / AI viết impl, hoặc AI viết cả hai rồi bạn đối chiếu với mẫu tay). Refactor: bạn, xuyên suốt.

**2. Được.** Khớp với sự thật là trần thẩm định của bạn tăng trong tuần — ngày 3 bạn đã nhìn ra test rỗng, ngày 1 thì chưa. Có một "mẫu vàng" do chính tay bạn viết để đối chiếu mọi output AI về sau; đây là cách kiểm soát chất lượng rẻ nhất khi chưa có kinh nghiệm. Và câu chuyện dùng AI dễ kể, dễ tin: có mốc, có lý do nâng mức.

**3. Mất, mất lúc nào.** Điểm chuyển mức phụ thuộc vào bạn tự đánh giá mình đã đủ nghề chưa — và người mới thường đánh giá cao hơn thực tế. Mất ở ngày 4–5, khi nhận ra mấy lệnh sau có chất lượng test kém hẳn hai lệnh đầu. Codebase không đồng nhất: hai phong cách trong một repo, chi phí rơi vào lúc refactor và lúc tuần 2 phải sửa xuyên qua cả hai. Và ngày 1–2 vẫn chậm y như PA C, nên nếu tắc ở cấu hình thì cả kế hoạch trượt ngay đầu tuần.

**4. Hỏng rõ nhất khi.** Khi lát cắt đầu chọn quá dễ — add + list trên một mảng in-memory — nên không chạm vào bất kỳ quyết định khó nào. Mẫu vàng lúc đó không dạy bạn gì về persistence, về lỗi, về async: đúng ba thứ tuần 2 sẽ bẻ. Hỏng lần hai khi ngày 1–2 kéo thành ngày 1–4 và phần còn lại bị dồn, khiến mức AI nhảy thẳng lên PA D trong trạng thái hoảng.

### PA G — Bạn chốt chữ ký bằng test đầu tiên; AI chỉ bổ sung test case sau đó

**1. Ai viết gì.** Với mỗi đơn vị: bạn viết test happy path đầu tiên → chữ ký, tên, kiểu trả về, sync/async được chốt → bạn viết impl tối thiểu. Sau đó AI được đọc file test + impl và chỉ được thêm test case mới trên chữ ký đã có: biên, rỗng, trùng, sai kiểu, lỗi. Bạn xử lý các test đỏ mới sinh ra. Refactor: bạn.

**2. Được.** Chặn được design-by-autocomplete — khác hẳn PA B, vì chữ ký là của bạn và AI không có quyền đổi. Vẫn lấy được thứ người mới thiếu nhất: trí tưởng tượng về edge case. Và mỗi test AI thêm mà đỏ là một bug thật vừa được phát hiện — tín hiệu học rất mạnh vì nó cụ thể, có địa chỉ.

**3. Mất, mất lúc nào.** Mất nhịp: AI ném cho bạn một loạt test đỏ cùng lúc, trong khi TDD muốn một test đỏ tại một thời điểm; dễ trượt vào chế độ sửa hàng loạt. Mất từ ngày 2. Mất thời gian phân loại: một phần test AI đề xuất là yêu cầu bịa (nó tự cho rằng title rỗng phải ném lỗi), và bạn phải quyết cái nào là spec thật — việc đó đúng là việc của architect, nên không mất quyền, chỉ mất giờ. Và nó không cắt được thời gian gõ impl, nên tổng công sức của bạn gần bằng PA C.

**4. Hỏng rõ nhất khi.** Khi bạn nhận hết mọi test AI đề xuất mà không lọc. Lúc đó AI đã âm thầm mở rộng spec, và bạn có một CLI với những hành vi bạn chưa từng chọn — mất quyền architect qua cửa sau, đúng cái cửa mà phương án này sinh ra để khoá. Hỏng lần hai khi số test phình nhanh hơn tốc độ bạn hiểu chúng: ngày 5, suite đỏ 12 chỗ, bạn không phân biệt được chỗ nào quan trọng.

### Bảng gọn để đối chiếu

| | Test | Impl | Refactor | Chi phí rơi vào lúc nào |
|---|---|---|---|---|
| A | Bạn | AI | Bạn | Lúc debug (ngày 5) và lúc sửa ở tuần 2 |
| B | AI | Bạn | Bạn | Ngày 1 (mất design), lộ ra ở tuần 2 và lúc bảo vệ |
| C | Bạn | Bạn | Bạn | Ngày 1 (setup) và ngày 6–7 (scope hụt) |
| D | AI | AI | AI | Ngày 1 (ẩn), bùng ra khi có bug mà test vẫn xanh |
| E | Bạn ở lõi / AI ở rìa | như trên | Bạn ở lõi | Rải đều mỗi ngày (phân xử ranh giới) + tuần 2 ở vùng I/O |
| F | Bạn → nâng dần | Bạn → nâng dần | Bạn | Ngày 1–2 (chậm), ngày 4–5 (chất lượng lệch) |
| G | Bạn (đầu) + AI (bổ sung) | Bạn | Bạn | Ngày 2 trở đi (nhịp + phân loại test bịa) |

**Ghép được:** E (theo vùng) và F (theo thời gian) là trục độc lập với A/B/D/G (theo pha) — ví dụ E ở mức tổng thể, còn bên trong vùng lõi thì chạy theo A hoặc G. Ngược lại, A/B/D/G loại trừ nhau tại một thời điểm cho cùng một đơn vị code; F chính là cách chuyển giữa chúng theo lịch.

---

## Bước 3 — vặn lại phương án yếu nhất

*Chưa chạy.*

## Bước 4 — ràng buộc của mình, và tự chọn

*Chưa xong. Đây là bước duy nhất không hỏi AI.*

## Bước 5 — đưa lựa chọn ra để bị vặn

*Chưa chạy.*
