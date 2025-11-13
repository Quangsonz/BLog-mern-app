 // phản hồi trả lỗi tùy chỉnh cho ứng dụng
class ErrorResponse extends Error {
    constructor(message, codeStatus) {
        super(message);
        this.codeStatus = codeStatus;
    }
}

module.exports = ErrorResponse;