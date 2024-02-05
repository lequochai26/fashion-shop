import HttpMethod from "../types/HttpMethod";
import e from "express";
import QueryString from "qs";

/**
 * Bộ xử lý yêu cầu HTTP.
 */
export default interface RequestHandler {
    /**
     * Lấy đường dẫn tương ứng với bộ xử lý yêu cầu HTTP này
     * @return {string} Đường dẫn mà bất cứ yêu cầu HTTP nào trỏ đến đều sẽ được bộ xử lý này xử lý.
     */
    getPath(): string;

    /**
     * Lấy phương thức HTTP mà bộ xử lý này sẽ xử lý.
     * @returns {HttpMethod} Phương thức HTTP mà bộ xử lý yêu cầu này sẽ xử lý.
     */
    getMethod(): HttpMethod;
    
    /**
     * Phương thức này sẽ được gọi để xử lý yêu cầu HTTP có đường dẫn khớp, phương thức khớp với đường dẫn, phương thức của bộ xử lý này.
     * @param req - Yêu cầu HTTP
     * @param res - Phản hồi HTTP
     */
    handle: e.RequestHandler<{}, any, any, QueryString.ParsedQs, Record<string, any>>
}