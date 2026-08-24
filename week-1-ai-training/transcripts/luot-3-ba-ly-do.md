# Lượt 3 — ba lý do viết test trước, TDD là thiết kế, khi nào không hợp

> Chép nguyên văn. Tương ứng mục **Lượt 3** trong `../ai-workflow-log.md`.
> Phần đầu là prompt của mình, phần sau là trả lời của AI.
>
> Đối chiếu đáng chú ý: bản này đưa **5 lý do**, `01-tdd-principles.md` chỉ giữ **3**.
> Lý do 4 và 5 bị mình loại — xem cột "Mình sửa lại gì, vì sao" ở Lượt 3 trong log.

---

Tôi là intern, đang nghiên cứu TDD tuần này, tuần sau build một CLI quản lý
ticket bằng TypeScript + Jest theo TDD.
Tôi đã hiểu vòng lặp Red-Green-Refactor, triangulation, và Fake It rồi —
đừng giải thích lại mấy cái đó.
Trả lời ba câu này:
1. Ít nhất 3 lý do cụ thể để viết test TRƯỚC. Với mỗi lý do, nói rõ nếu viết
   test SAU thì mất chính xác cái gì. Tôi cần phần MẤT GÌ, không cần phần
   "lợi ích chung chung".
2. Vì sao TDD được gọi là hoạt động thiết kế chứ không chỉ là hoạt động
   testing? Cụ thể: viết test trước ép tôi phải ra quyết định thiết kế nào
   mà viết code trước thì không?
3. Khi nào TDD KHÔNG phải cách phù hợp? Nêu tình huống cụ thể, và với mỗi
   tình huống thì nên làm gì thay thế.
Tách rõ chỗ nào là đồng thuận trong ngành, chỗ nào là quan điểm còn tranh cãi.
Trả lời bằng tiếng Việt.
Ba câu này đúng là ba chỗ trống trong 01-tdd-principles.md. Trước khi trả lời câu 2, tôi muốn có bằng chứng chạy được thay vì khẳng định suông — dựng lại demo cũ:
Ran 3 commands
Cả ba câu này chính là ba mục trống trong 01-tdd-principles.md. Bằng chứng cho câu 2 tôi vừa chạy thật, số liệu ở dưới.
Câu 1 — Ba lý do viết test TRƯỚC, và mất chính xác cái gì nếu viết SAU
Lý do 1: Test viết sau bị neo vào code đã tồn tại
Mất chính xác cái gì: mất những test case mà code hiện tại chưa xử lý.
Khi bạn đã đọc implementation rồi mới viết test, bạn đọc các nhánh if đang có và viết test phủ chúng. Bạn đang test cái code làm, không phải cái nó phải làm. Hai thứ đó chỉ khác nhau đúng ở chỗ có bug.
Cụ thể với tickets update <id> tuần sau: nếu bạn code trước, hàm sẽ có nhánh "tìm thấy" và nhánh "không tìm thấy", và bạn sẽ viết đúng 2 test đó. Câu hỏi "update một ticket đã done thì sao?" chỉ nảy ra khi bạn ngồi viết đặc tả từ ngoài vào — vì lúc đó không có code nào gợi ý cho bạn phạm vi. Code-first không bao giờ nhắc bạn về nhánh nó không có.
✅ ĐỒNG THUẬN rằng hiệu ứng neo này tồn tại và test-sau phủ hẹp hơn.
⚠️ TRANH CÃI về độ lớn: người kỷ luật cao viết test sau vẫn có thể liệt kê case từ spec trước khi đọc code.
Lý do 2: Test viết sau không có bằng chứng nó biết fail
Mất chính xác cái gì: mất khả năng phân biệt "code đúng" với "test không kiểm tra gì".
Test viết sau chạy lần đầu đã xanh. Xanh đó có hai nguyên nhân khả dĩ và bạn không có cách nào phân biệt. Đây không phải lo xa — tôi vừa chạy:
// code viết trước, giờ mới đi test:
expect(t.id).toBeDefined();
expect(t.createdAt).toBeDefined();
Tests: 1 passed, 1 total
Rồi tôi phá code:
Tôi phá gì	Kết quả
createdAt → 'khong-phai-ngay-thang'	Tests: 1 passed ❌ không bắt được
id → '' (chuỗi rỗng)	Tests: 1 passed ❌ không bắt được
Test này vô dụng hoàn toàn nhưng trông y hệt test có ích trong báo cáo coverage. Bắt buộc thấy đỏ trước là cơ chế duy nhất loại được loại test này một cách hệ thống.
Để ý: toBeDefined() chính là ví dụ kinh điển của weak assertions — lỗi số 2 trong 05-common-mistakes.md của bạn. Nó không phải lỗi ngẫu nhiên; nó là hệ quả cấu trúc của việc viết test sau, vì lý do 3 dưới đây.
✅ ĐỒNG THUẬN mạnh. Gần như không ai phản đối "phải thấy đỏ trước".
Lý do 3: Test viết sau chấp nhận thiết kế đang có, kể cả khi thiết kế đó không test được
Mất chính xác cái gì: mất cửa sổ sửa rẻ. Vấn đề vẫn bị phát hiện — nhưng phát hiện lúc sửa đắt gấp nhiều lần.
Đây là lý do toBeDefined() ở trên xuất hiện. Code viết trước trông rất tự nhiên:
export function createTicket(title: string): Ticket {
  return {
    id: randomUUID(),                      // ← nguồn không xác định, chôn bên trong
    title,
    status: 'open',
    createdAt: new Date().toISOString(),   // ← nguồn không xác định, chôn bên trong
  };
}
Không có gì sai về mặt chạy được. Nhưng từ ngoài không tồn tại cách assert chính xác id hay createdAt. Người viết test sau không có lựa chọn nào ngoài assert yếu — hoặc đi sửa chữ ký hàm, tức là sửa cả những chỗ đã gọi nó.
Test viết trước thì bức tường đó đập vào mặt bạn khi chưa có dòng code nào, lúc sửa gần như miễn phí:
const fixedClock = { now: () => new Date('2026-08-20T10:00:00.000Z') };
const seqIdGen  = () => { let n = 0; return { next: () => `T-${++n}` }; };
expect(t.id).toBe('T-1');
expect(t.createdAt).toBe('2026-08-20T10:00:00.000Z');
Cùng một phép phá hoại, kết quả ngược lại:
Expected: "2026-08-20T10:00:00.000Z"
Received: "khong-phai-ngay-thang"
Tests: 1 failed, 1 passed, 2 total
Chi phí thực tế của việc phát hiện muộn, tính theo lịch của bạn: tới lúc cả 4 lệnh CLI đã gọi createTicket, đổi chữ ký là refactor lan ra 4 chỗ + toàn bộ test đã viết. Ở tuần 3 nối KB API thì lan tiếp.
✅ ĐỒNG THUẬN rằng test-first phát hiện vấn đề test-ability sớm hơn.
⚠️ TRANH CÃI rằng bản sửa (tiêm clock/idGen) có phải thiết kế tốt hơn không — xem câu 2.
Lý do 4: Mất tiêu chí dừng khách quan
Mất chính xác cái gì: mất định nghĩa "xong".
Test viết trước là hợp đồng: xanh hết = xong, dừng. Không có nó, "xong" là một cảm giác, và cảm giác thì trượt về hai phía — hoặc bạn thêm tính năng không ai yêu cầu (tickets archive, ai mà biết), hoặc bạn dừng sớm ở chỗ "chắc ổn rồi".
Lý do 5: Test viết sau thường không bao giờ được viết
Mất chính xác cái gì: mất luôn test. Deadline tới, code chạy rồi, task sau đang chờ. Lý do tầm thường nhất, nhưng nếu hỏi các đội thật thì đây là lý do phổ biến nhất.
Câu 2 — Vì sao TDD là hoạt động thiết kế
Cách nói chính xác nhất, và tôi khuyên bạn dùng đúng câu này trong interview:
TDD không đảm bảo thiết kế tốt. Nó làm cho thiết kế xấu trở nên ĐAU SỚM — lúc sửa còn rẻ.
Test là khách hàng đầu tiên của code bạn. Viết test trước nghĩa là bạn buộc phải sống với API của mình trước khi bỏ công xây nó.
Dưới đây là những quyết định thiết kế mà test-first ép bạn chốt, còn code-first cho phép bạn né:
1. Ranh giới public API — chốt từ góc nhìn người dùng
Dòng đầu tiên của test là một lời gọi. Trước khi tồn tại một dòng implementation nào, bạn đã phải quyết: tên hàm, nhận gì, thứ tự tham số, trả về gì, ném gì.
Code-first cũng quyết những thứ đó — nhưng từ góc nhìn người viết bên trong, nên API thường rò rỉ chi tiết nội bộ ra ngoài (trả về đúng cái struct nội bộ đang có, tham số phản ánh các bước xử lý bên trong).
2. Nguồn không xác định đến từ đâu — quyết định kiến trúc, không phải quyết định testing
Đây là ví dụ ở trên. Câu hỏi "thời gian và id đến từ đâu?" là câu hỏi kiến trúc. Code-first không bao giờ bắt bạn hỏi — randomUUID() gọi là xong, chạy tốt. Test-first bắt bạn trả lời trong 30 giây đầu.
Và câu trả lời (tiêm dependency vào) thay đổi hình dạng hệ thống của bạn: createTicket trở thành hàm thuần với đầu vào tường minh, thay vì hàm ngầm đọc trạng thái toàn cục. Đó là thiết kế, không phải test.
3. Hình dạng của lỗi
Để viết expect(...) cho ca lỗi, bạn phải chốt cơ chế lỗi trước: ném Error? Ném lớp lỗi riêng? Trả về Result<Ticket, TicketError>? Trả exit code?
Code-first thường trôi dạt — chỗ này throw new Error('...'), chỗ kia return null, chỗ nữa process.exit(1) — và bạn chỉ phát hiện sự thiếu nhất quán khi đi viết tầng xử lý lỗi ở CLI, tức là quá muộn. Với 3 error case bắt buộc trong 03-cli-test-plan.md, đây là quyết định bạn phải chốt một lần, sớm.
4. Kích thước và số trách nhiệm — có tín hiệu đo được
Test khó viết là tín hiệu thiết kế. Cụ thể là ba tín hiệu đọc được:
Triệu chứng trong test	Bệnh trong thiết kế
Setup 20 dòng mới gọi được hàm	Hàm ôm quá nhiều trách nhiệm
Phải mock 5 thứ	Coupling cao — số mock ≈ số coupling
Không assert được nếu không chọc vào nội bộ	Hành vi không lộ ra ở bề mặt công khai
Code-first không có tín hiệu này — vì bạn không bao giờ phải dựng hàm đó từ bên ngoài. Bạn luôn ở bên trong, nơi mọi thứ đều trong tầm tay.
5. Đường biên giữa logic thuần và I/O
Rất cụ thể cho CLI của bạn: nếu createCommand vừa parse process.argv, vừa validate, vừa ghi file JSON, thì test-first sẽ đau ngay lập tức — bạn phải dựng argv giả, dựng filesystem giả, chỉ để kiểm tra một luật validate. Cái đau đó đẩy bạn tách ra.
Code-first thì phiên bản trộn lẫn chạy tốt. Bạn không thấy đau — cho tới tuần 3, khi nối KB API vào, và giờ mỗi test phải giả lập cả file system lẫn network.
⚠️ ĐÂY LÀ CHỖ TRANH CÃI LỚN NHẤT CỦA CẢ CÂU 2.
Phe ủng hộ (Kent Beck; Freeman & Pryce, Growing Object-Oriented Software, Guided by Tests): áp lực từ test dẫn tới coupling thấp, trách nhiệm rõ — tức thiết kế tốt hơn.
Phe phản đối (rõ nhất là DHH, 2014): ông đặt tên cho hiện tượng này là "test-induced design damage" — lập luận rằng việc bẻ code để nó test được (tiêm dependency, thêm tầng gián tiếp, tách interface cho mọi thứ) làm code phức tạp hơn để phục vụ test chứ không phục vụ bài toán.
Nhìn lại ví dụ của tôi cho công bằng: tôi biến createTicket(title) thành createTicket(title, { clock, idGen }). Phe Beck gọi đó là làm rõ phụ thuộc ngầm. DHH gọi đó là ceremony. Cả hai đều có lý, và bạn nên biết mình đang chọn phe nào khi bị hỏi.
✅ Phần đồng thuận giữa hai phe: test-first làm lộ ra các quyết định thiết kế sớm hơn. Bất đồng nằm ở chỗ phản ứng lại với những gì bị lộ ra có phải lúc nào cũng cải thiện code không.
Câu 3 — Khi nào TDD KHÔNG phù hợp
1. Code khám phá — bạn chưa biết mình muốn gì
TDD đòi bạn viết kỳ vọng trước. Nếu bạn chưa biết kỳ vọng, viết test là bịa.
Tình huống: API lạ, thư viện mới, không rõ response trả về hình dạng gì.
Thay thế: spike có giới hạn thời gian. Đặt hẹn giờ (60–90 phút), viết code nháp bẩn, mục tiêu duy nhất là học, không phải ship. Rồi vứt spike đi và TDD lại từ đầu với hiểu biết vừa có.
🎯 Áp dụng thẳng vào tuần 3 của bạn: đừng TDD phần nối KB API lúc mới bắt đầu. Gọi API thật, xem response thật, lưu response đó thành file fixture, rồi mới TDD với fixture. Viết test dựa trên đoán mò response sẽ ra là bạn đang test trí tưởng tượng của mình.
✅ ĐỒNG THUẬN: spike là kỹ thuật hợp lệ, chính Kent Beck mô tả nó.
⚠️ TRANH CÃI: có thật sự phải vứt spike không, hay dọn dẹp rồi giữ lại. (Vứt là lời khuyên chính thống; giữ là điều đa số thực sự làm.)
2. Cái "đúng" là chuyện thị giác / thẩm mỹ
Không assert được expect(output).toLookGood().
Tình huống trong CLI của bạn: format bảng output tickets list — căn cột, màu, chiều rộng, cách cắt chuỗi dài.
Thay thế: snapshot test để chống hồi quy (bắt được thay đổi ngoài ý muốn, không phán xét được đẹp hay xấu), cộng với xem bằng mắt. Vẫn TDD phần logic đằng sau (lọc gì, sắp xếp thế nào, dữ liệu nào lọt vào) — chỉ miễn TDD cho phần trình bày.
⚠️ TRANH CÃI: mức độ hữu ích của snapshot test. Nhiều người coi chúng là ổ weak assertions vì ai cũng bấm -u cho qua mà không đọc diff.
3. Throwaway / prototype để chốt yêu cầu
Chi phí test không hoàn vốn nếu code sống 2 giờ.
Thay thế: kiểm tra thủ công, giữ input nhỏ và kiểm chứng được bằng mắt. Chuyển sang TDD ngay khi có ai đó nói "cái này dùng luôn được đấy".
⚠️ TRANH CÃI, và tôi nghiêng về phía hoài nghi: rất nhiều "throwaway code" sống mười năm. Cân nhắc kỹ trước khi tự cấp cho mình cái nhãn này.
4. Sửa bug trong code legacy chưa có test
Nghịch lý: TDD thuần bảo viết unit test trước, nhưng code legacy thường không cho phép — mọi thứ dính chặt nhau, không có chỗ chèn.
Thay thế: viết characterization test ở tầng cao nhất mà bạn chạm được (kể cả e2e, kể cả chậm) để khoá hành vi hiện tại — kể cả hành vi sai. Có lưới rồi mới tách dần, tạo "seam", rồi TDD ở tầng đơn vị. Đây là nội dung cuốn Working Effectively with Legacy Code (Michael Feathers).
✅ ĐỒNG THUẬN mạnh — và lưu ý một ngoại lệ quan trọng đi ngược hướng: khi sửa bug, viết test tái hiện bug trước khi sửa là ca TDD ít gây tranh cãi nhất trong toàn ngành. Kể cả người ghét TDD phần lớn vẫn làm cái này. Lý do: bạn có bằng chứng đã tái hiện đúng bug, và có bảo hiểm chống nó quay lại. Nếu interview hỏi "khi nào TDD chắc chắn đáng", đây là câu trả lời an toàn nhất.
5. Vấn đề là hiệu năng, đồng thời, hoặc phân tán
Unit test xanh không nói gì về race condition, deadlock, hay p99 latency. Tệ hơn: chúng tạo cảm giác an toàn giả.
Thay thế: benchmark và load test cho hiệu năng; stress test và fuzz/property-based testing cho đồng thời; deterministic simulation nếu nghiêm túc. Khác loại công cụ, không phải khác liều lượng.
✅ ĐỒNG THUẬN: TDD không phủ được nhóm vấn đề này.
Bảng tổng kết: đồng thuận vs tranh cãi
✅ Đồng thuận rộng	⚠️ Còn tranh cãi thật sự
Phải thấy test đỏ trước khi làm nó xanh	TDD có cải thiện thiết kế không (Beck / Freeman & Pryce ⟷ DHH "test-induced design damage")
Weak assertions (toBeDefined) là lỗi, không phải test	Tiêm dependency để test được là làm rõ hay là ceremony thừa
Sửa bug ⇒ viết test tái hiện bug trước	Nên TDD bao nhiêu % thời gian
Spike/exploration là ngoại lệ hợp lệ của test-first	Có phải vứt spike đi không
Legacy ⇒ characterization test trước khi refactor	Snapshot test đáng giá hay là ổ weak assertion
TDD không thay được benchmark / load / fuzz test	"Test khó viết = thiết kế xấu" — chỉ dấu đáng tin, hay là ngụy biện vòng quanh (đôi khi bài toán vốn khó)
Test là khách hàng đầu tiên ⇒ lộ quyết định thiết kế sớm	TDD có hợp cho UI không
Demo còn nguyên trong scratchpad (codeFirst.ts / testFirst.ts cùng test của chúng) — cặp đối chiếu này là snippet tốt cho 01, và đúng định dạng "snippet, không project" mà mentor đã chốt.
Còn một câu trong 01 vẫn để trống mà bạn chưa hỏi: "May tests be modified during the Refactor step?". Muốn tôi trả lời nốt, hay viết ba phần trên vào file trước?