const bookStatus = {
    found: 0,
    hidden: 1,
};
class BookCopy {
    constructor(copyId, bookId, place, date) {
        this.copyId = copyId;
        this.bookId = bookId;
        this.status = bookStatus.hidden;
        this.place = place;
        this.date = date;
    }
}

module.exports = {BookCopy, bookStatus};