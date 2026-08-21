function createTicket(title) {
    if (title.trim() === '') throw new Error('title không được rỗng');
    return { title: title, status: 'open' };
}

module.exports = { createTicket };