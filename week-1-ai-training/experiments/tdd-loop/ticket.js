// Code that createTicket phai lam cho test xanh.
//
// BUOC 1 cua bai: doi dong duoi thanh   return { title: title };
// tuc la BO status di, roi chay test -> se DO.
// Do la buoc RED. Xong thi tra lai nhu cu -> GREEN.

function createTicket(title) {
  if (title.trim() === '') throw new Error('title không được rỗng');
  return { title: title, status: 'open' };
}

module.exports = { createTicket };
