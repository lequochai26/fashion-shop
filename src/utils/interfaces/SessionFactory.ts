import { Request, Response } from "express";
import Session from "../Session";
import { Express } from "express";

/**
 * Bộ quản lý phiên làm việc của người dùng
 */
export default interface SessionFactory {
    /**
     * Truy vấn hoặc tạo mới phiên làm việc của người dùng
     * @param request Yêu cầu HTTP
     * @param response Phản hồi HTTP
     * @returns Phiên làm việc
     */
    retrieve(request: Request, response: Response): Session;

    /**
     * Truy vấn phiên làm việc của người dùng
     * @param sessionId Mã phiên làm việc (được lấy từ cookie máy khách)
     */
    get(sessionId: string): Session | undefined;

    /**
     * Truy vấn tất cả phiên làm việc có trong hệ thống
     * @returns Danh sách phiên làm việc có trong hệ thống
     */
    getAll(): Session[]

    /**
     * Tạo phiên làm việc mới
     * @returns Mã phiên làm việc mới và phiên làm việc mới
     */
    create(): [ string, Session ];

    /**
     * Xóa một phiên làm việc đã tồn tại
     * @param sessionId Mã phiên làm việc (được lấy từ cookie máy khách)
     */
    clear(sessionId: string): void;

    /**
     * Áp dụng bộ quản lý phiên làm việc cho Express App.
     * @param app Express App
     */
    apply(app: Express): void
}