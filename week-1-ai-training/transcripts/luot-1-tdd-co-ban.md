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
Ran 2 commands
TypeScript 7 vừa ra và ts-jest chưa hỗ trợ — đây là một cái bẫy thật cho tuần sau của bạn. Ghim về TS 5:
Pin TypeScript 5 and rerun
RED #1 xác nhận. Giờ chạy hết các vòng và ghi lại output thật của từng bước:
Ran 9 commands
Xong. Mọi output dưới đây là output thật tôi vừa chạy, không phải tôi nhớ lại.
Phần 1 — TDD là gì, và chuyện gì xảy ra ở từng bước
Định nghĩa ngắn
TDD (Test-Driven Development) là: bạn viết một test cho một hành vi chưa tồn tại, xem nó fail, viết code tối thiểu để nó pass, rồi dọn dẹp code trong khi test vẫn xanh. Lặp lại — mỗi vòng chỉ vài phút.
Điểm quan trọng nhất, và cũng là điểm hay bị bỏ qua: TDD là một vòng lặp cho từng hành vi một, không phải một pha "viết test" đứng trước một pha "viết code".
Setup (đã kiểm chứng, có một cái bẫy thật)
npm init -y && npm i -D jest ts-jest @types/jest "typescript@^5"
Chú ý typescript@^5. Tôi thử cài typescript không ghim version, npm kéo về TypeScript 7.0.2, và ts-jest 29 từ chối chạy:
The TypeScript compiler "typescript" (version 7.0.2) does not expose the
JavaScript compiler API required by ts-jest.
Tuần sau bạn sẽ đâm đầu vào đúng lỗi này nếu không ghim. jest.config.js:
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = { preset: 'ts-jest', testEnvironment: 'node' };
Vòng 1
🔴 RED — viết test trước, cho code chưa tồn tại
src/ticket.test.ts:
import { createTicket } from './ticket';
describe('createTicket', () => {
  it('tạo ticket mới với status "open"', () => {
    const t = createTicket('Fix login bug');
    expect(t.status).toBe('open');
  });
});
src/ticket.ts chưa tồn tại. Chạy npx jest:
FAIL src/ticket.test.ts
  ● Test suite failed to run
    src/ticket.test.ts:1:30 - error TS2307: Cannot find module './ticket'
Chuyện gì xảy ra ở bước này: bạn vừa viết ra đặc tả trước khi viết hiện thực. Bằng cách gõ createTicket('Fix login bug'), bạn đã quyết định: tên hàm, nó nhận gì, nó trả về gì, và trường status tồn tại. Đó là thiết kế API, và bạn đang thiết kế nó từ vị trí của người dùng nó, chứ không phải người viết nó. Đây là giá trị cốt lõi của TDD, không phải "có test".
Lưu ý cho TypeScript: lỗi compile cũng là RED hợp lệ. Nhiều người mới tưởng phải chạy được rồi mới tính.
🟢 GREEN — code tối thiểu để xanh
export interface Ticket {
  title: string;
  status: 'open' | 'done';
}
export function createTicket(title: string): Ticket {
  return { title, status: 'open' };
}
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Chuyện gì xảy ra: "tối thiểu" là có kỷ luật, không phải có nghĩa vụ ngu ngốc. Ở đây tôi không thêm validate, không thêm priority, không thêm id — dù tôi biết chắc sẽ cần. Lý do: mỗi dòng code chưa có test là một dòng bạn không có bằng chứng nó đúng.
Nhưng để ý một chuyện thật: TypeScript ép tôi vượt qua mức tối thiểu. Test chỉ hỏi status, nhưng kiểu Ticket bắt tôi trả cả title. Trong TDD với ngôn ngữ có kiểu, type system đôi khi là "test đầu tiên" của bạn. Điều này bình thường, không phải bạn làm sai.
Vòng 2 — 🔴 RED
it('ném lỗi khi title rỗng', () => {
  expect(() => createTicket('')).toThrow('title không được rỗng');
});
● createTicket - validate title › ném lỗi khi title rỗng
  expect(received).toThrow(expected)
  Expected substring: "title không được rỗng"
  Received function did not throw
Tests: 1 failed, 1 passed, 2 total
Chuyện gì xảy ra: đây là lý do RED bắt buộc phải xảy ra trước. Fail message này chứng minh test thật sự đang kiểm tra thứ tôi nghĩ nó kiểm tra. Nếu tôi viết code trước rồi viết test sau và nó xanh ngay, tôi không có bằng chứng nào rằng test đó không phải một test rỗng luôn-xanh. Đây là bug phổ biến nhất trong test suite của người mới.
🟢 GREEN — tối thiểu, đúng nghĩa đen:
if (title === '') throw new Error('title không được rỗng');
Vòng 3 — 🔴 RED (triangulation)
'' pass rồi, nhưng ' ' thì sao?
it('coi title chỉ có khoảng trắng là rỗng', () => {
  expect(() => createTicket('   ')).toThrow('title không được rỗng');
});
Tests: 1 failed, 2 passed, 3 total
🟢 GREEN: if (title.trim() === '') → Tests: 3 passed, 3 total
Chuyện gì xảy ra: kỹ thuật này gọi là triangulation. Bạn cố tình viết implementation "hơi sai" (=== ''), rồi dùng test thứ hai để ép nó tổng quát hóa. Đây là cách TDD biến "tôi đoán code này đúng" thành "tôi có hai ví dụ chứng minh".
Vòng 4 — 🔴 RED (bài học riêng của TypeScript)
it('mặc định priority là "medium"', () => {
  expect(createTicket('Fix login bug').priority).toBe('medium');
});
it('dùng priority được truyền vào', () => {
  expect(createTicket('Fix login bug', 'high').priority).toBe('high');
});
● Test suite failed to run
  src/ticket.test.ts:28:42 - error TS2554: Expected 1 arguments, but got 2.
Tests: 0 total
Để ý Tests: 0 total. Một lỗi kiểu làm toàn bộ file test không chạy — kể cả 3 test đang xanh. Trong JS thuần bạn sẽ thấy "1 failed, 3 passed". Trong TS bạn thấy con số 0. Người mới hay hoảng ở đây vì tưởng mình vừa phá vỡ mọi thứ. Không — chỉ là compile fail.
🟢 GREEN:
export function createTicket(title: string, priority: Priority = 'medium'): Ticket {
  if (title.trim() === '') throw new Error('title không được rỗng');
  return { title, priority, status: 'open' };
}
Tests: 5 passed, 5 total
🔵 REFACTOR
const DEFAULT_PRIORITY: Priority = 'medium';
function assertValidTitle(title: string): void {
  if (title.trim() === '') {
    throw new Error('title không được rỗng');
  }
}
export function createTicket(
  title: string,
  priority: Priority = DEFAULT_PRIORITY,
): Ticket {
  assertValidTitle(title);
  return { title, priority, status: 'open' };
}
Tests: 5 passed, 5 total
Chuyện gì xảy ra: tôi đổi cấu trúc, không đổi hành vi. Không thêm test nào. Số test trước và sau y hệt nhau — đó chính là bằng chứng tôi đã refactor chứ không phải viết lại. Test suite ở đây đóng vai trò lưới an toàn: nó cho phép bạn mạnh tay sửa code mà không phải cầu nguyện.
Và đây là chỗ tôi tự chứng minh giới hạn của chính lưới an toàn đó
Tôi sửa code để đổi hành vi, xem test có bắt được không.
Thí nghiệm A — lén lưu title.trim() thay vì title:
Tests: 5 passed, 5 total    ← KHÔNG bắt được
Thí nghiệm B — đổi DEFAULT_PRIORITY thành 'low':
Expected: "medium"
Received: "low"
Tests: 1 failed, 4 passed, 5 total    ← bắt được
Đây là điều quan trọng nhất trong cả câu trả lời này: test suite chỉ bảo vệ đúng những gì nó khẳng định. 5/5 xanh không có nghĩa là code đúng. Nó có nghĩa là 5 khẳng định cụ thể đó vẫn đúng. Nếu trong bước Refactor bạn vô tình đổi hành vi mà không test nào phủ, bạn sẽ không biết.
Mẹo tự kiểm chứng suốt tuần sau, và cũng là cách bạn tự phát hiện tôi nói sai: cố tình phá code của bạn và xem test có đỏ không. Nếu bạn phá mà test vẫn xanh, test đó vô dụng. Kỹ thuật này gọi là mutation testing thủ công, và nó không đòi hỏi kinh nghiệm — chỉ cần bạn chịu thử.
Phần 2 — Đâu là ĐỒNG THUẬN, đâu là QUAN ĐIỂM
Tôi tách rõ, vì đây đúng là chỗ bạn dễ bị dắt mũi nhất — nhiều bài blog trình bày quan điểm cá nhân bằng giọng của chân lý.
✅ ĐỒNG THUẬN rộng (gần như không ai trong ngành phản đối)
Nguyên tắc	Vì sao
Test phải fail trước, và bạn phải tận mắt nhìn thấy nó fail	Không nhìn thấy đỏ thì không có bằng chứng test đang kiểm tra gì. Cái này gần như tiên đề.
Chỉ refactor khi test đang xanh	Refactor trên nền đỏ = bạn không biết cái đỏ mới đến từ đâu.
Không vừa refactor vừa thêm feature	Hai loại thay đổi khác nhau, trộn vào nhau thì không debug được.
"Refactor" = đổi cấu trúc, KHÔNG đổi hành vi quan sát được	Đây là định nghĩa kỹ thuật, không phải cách nói thông tục.
Bước nhỏ, vòng lặp ngắn	Vòng lặp càng ngắn, khoảng cách giữa "gây ra bug" và "biết mình gây bug" càng nhỏ.
Unit test phải nhanh và deterministic	Test chạy 30 giây hoặc thỉnh thoảng đỏ ngẫu nhiên thì bạn sẽ ngừng chạy nó, và nó thành vô dụng.
Coverage cao ≠ code đúng	Xem thí nghiệm A ở trên. Coverage 100% vẫn để lọt.
Test có giá trị như tài liệu sống	Test đọc được cho bạn biết hệ thống phải làm gì.
⚠️ QUAN ĐIỂM còn tranh cãi (người có kinh nghiệm bất đồng thật sự)
1. TDD có thực sự cải thiện chất lượng/năng suất không?
Bằng chứng thực nghiệm hỗn hợp, không dứt khoát. Đáng chú ý, có nghiên cứu so sánh TDD với "iterative test-last" (viết code từng mẩu nhỏ rồi test ngay sau) và không tìm thấy khác biệt có ý nghĩa thống kê — gợi ý rằng lợi ích có thể đến từ bước nhỏ, chứ không phải từ test-first. Tôi khá tự tin về hướng kết luận này nhưng bạn nên tự tra cứu (từ khóa: Fucci et al., TDD external replication) thay vì tin tôi. Ai nói với bạn "nghiên cứu đã chứng minh TDD tốt hơn" là đang nói quá.
2. London school (mockist) vs Detroit/Chicago school (classicist)
London: mock hết dependency, test từng unit cô lập, thiết kế outside-in.
Detroit: dùng object thật, test theo trạng thái, mock chỉ cho I/O thật (network, disk, clock).
Đây là bất đồng thật, kéo dài hàng chục năm, cả hai phe đều có người rất giỏi. Không có phe đúng. Với CLI ticket của bạn, tôi nghiêng về Detroit (mock ít, dùng object thật) — nhưng đó là khuyến nghị, không phải sự thật.
3. "TDD is dead" (2014)
DHH viết bài đó, dẫn tới loạt tranh luận công khai giữa DHH, Martin Fowler và Kent Beck. Đáng xem chính vì nó cho bạn thấy ba người rất giỏi bất đồng một cách văn minh. Kent Beck — người viết cuốn TDD by Example — không hề chủ trương TDD cho mọi tình huống.
4. Test nên bám vào cái gì?
"Test hành vi, đừng test implementation" nghe hay nhưng ranh giới mờ, và mọi người cãi nhau về nó liên tục. Không có quy tắc máy móc.
5. "Unit" là gì?
Một hàm? Một class? Một module? Một hành vi? Không có định nghĩa được đồng thuận. Khi ai đó nói "unit test", hãy hỏi họ đang hiểu unit là gì.
6. Test pyramid vs Testing Trophy
Pyramid: nhiều unit, ít integration, rất ít e2e. Trophy (Kent C. Dodds): dồn trọng tâm vào integration. Tranh luận đang diễn ra.
7. Có bắt buộc test-first 100% thời gian không?
Nhiều người thực hành nghiêm túc vẫn "spike" (viết code nháp thăm dò, vứt đi, rồi mới TDD lại). Có người coi đó là gian lận. Tôi thì không.
Phần 3 — 3 điều người mới học TDD thường hiểu sai
❌ Hiểu sai 1: "TDD nghĩa là viết hết test rồi mới viết code"
Đây là hiểu sai phổ biến nhất, và nó phá hỏng toàn bộ lợi ích.
Người mới hay ngồi viết 15 test cho cả module, rồi mới bắt đầu code. Khi đó bạn có 15 test đỏ cùng lúc, không biết bắt đầu từ đâu, và bạn đã thiết kế toàn bộ API trước khi học được bất cứ điều gì từ việc implement nó — mất đúng cái vòng phản hồi mà TDD tồn tại để tạo ra.
Đúng: một test → xanh → refactor → một test tiếp theo. Ví dụ ở Phần 1 có 5 test, đi qua 4 vòng lặp. Không lúc nào có quá 1 test đỏ.
Hệ quả: TDD chủ yếu là hoạt động thiết kế, không phải hoạt động testing. Test là sản phẩm phụ.
❌ Hiểu sai 2: "Refactor nghĩa là dọn code cho đẹp"
Trong đời thường "refactor" nghĩa là "sửa lại cho gọn". Trong TDD nó có nghĩa hẹp và kỹ thuật:
Đổi cấu trúc bên trong mà không đổi hành vi quan sát được từ bên ngoài, với test xanh trước và sau.
Người mới hay làm sai theo hai kiểu:
Nhét feature vào bước Refactor. "Nhân tiện tôi thêm luôn validate cho priority." Không — đó là hành vi mới, phải quay lại RED.
Bỏ hẳn bước Refactor. Xanh rồi là chạy sang test tiếp theo. Sau 20 vòng thì code thành đống bùn, và bạn kết luận "TDD không hiệu quả". Bước Refactor không phải tùy chọn; nó chính là chỗ TDD trả lại giá trị.
Và nhớ thí nghiệm A: test không đảm bảo bạn refactor đúng. Nếu bạn đổi hành vi ở vùng không có test phủ, không ai báo bạn cả.
❌ Hiểu sai 3: "Mỗi class/hàm cần một file test, test mọi method"
Người mới thường thấy TicketService là lập tức tạo TicketService.test.ts rồi test lần lượt từng method, kể cả method nội bộ. Hậu quả:
Test dính chặt vào implementation. Mỗi lần refactor (đổi tên method, gộp/tách class) là hàng loạt test vỡ — dù hành vi không đổi. Lưới an toàn biến thành xiềng xích, và bạn bắt đầu sợ refactor.
Bạn đi mock các thành phần nội bộ của chính mình, cho tới lúc test chỉ còn kiểm tra rằng "mock đã được gọi" — tức là kiểm tra chính cái mock, không kiểm tra gì thật.
Đúng hơn: test hành vi qua bề mặt công khai. Trong ví dụ trên, assertValidTitle không có test riêng — nó được phủ gián tiếp qua createTicket. Vì thế tôi mới trích được nó ra ở bước Refactor mà không test nào vỡ.
Với CLI ticket tuần sau, việc này rất cụ thể: hãy để logic thuần (tạo/validate/lọc/sắp xếp ticket) tách khỏi I/O (đọc/ghi file, console.log, process.argv). TDD phần logic thuần thì dễ và rẻ. Phần I/O thì test ít hơn, ở tầng cao hơn. Nếu bạn thấy mình đang mock fs khắp nơi, thường đó là dấu hiệu logic và I/O đang bị trộn lẫn — chứ không phải dấu hiệu bạn cần mock giỏi hơn.
Cách tự bảo vệ mình trước những gì tôi vừa nói
Bạn nói bạn không có kinh nghiệm để phát hiện tôi sai, nên đây là phần thực tế nhất:
Chạy lại ví dụ trên. Nó chạy được thật — tôi vừa chạy. Nếu output của bạn khác, tin máy bạn, đừng tin tôi.
Phá code, xem test có đỏ không. Đây là công cụ kiểm chứng không cần kinh nghiệm.
Nguồn gốc để đối chiếu: Test-Driven Development by Example (Kent Beck) cho vòng lặp cốt lõi; các bài của Martin Fowler về Mocks Aren't Stubs và UnitTest cho phần tranh cãi; loạt "Is TDD Dead?" cho thấy chính các chuyên gia bất đồng ở đâu.
Khi ai đó (kể cả tôi) nói "nên", hỏi: đây là đồng thuận hay là phe phái? Phần lớn lời khuyên TDD trên mạng thuộc loại thứ hai nhưng viết như loại thứ nhất.
Project demo còn nguyên ở scratchpad nếu bạn muốn tôi mở rộng nó thành khung sườn cho CLI tuần sau — hoặc muốn tôi ghi lại phần này vào week-1-ai-training/, chỉ cần nói.
