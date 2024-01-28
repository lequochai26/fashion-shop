import { Request, Response } from "express";
import Session from "./Session";
import SessionFactory from "./interfaces/SessionFactory";

/**
 * Bản triển khai đơn giản, dễ sử dụng của SessionFactory (bộ quản lý phiên làm việc người dùng)
 */
export default class SimpleSessionFactory implements SessionFactory {
    // Static methods:
    /**
     * Yêu cầu cấp mã phiên mới
     * @returns Mã phiên mới được cấp
     */
    public static generateId(): string {
        return new Date()
        .getTime()
        .toString();
    }

    // Fields:
    private sessionStorage: SessionStorage;

    // Constructor:
    public constructor() {
        this.sessionStorage = {};
    }

    // Methods:
    public retrieve(request: Request, response: Response): Session {
        // Local functions:
        function newSession(self: SimpleSessionFactory, response: Response): Session {
            // Create new session
            const [ sessionId, session ]: [ string, Session ] = self.create();

            // Assign sessionId into response's cookies
            response.cookie("sessionId", sessionId);

            // Return session
            return session;
        }

        // Executions:
        // Get sessionId from request's cookies
        const sessionId: string | undefined = request.cookies.sessionId;

        // sessionId not found case
        if (!sessionId) {
            return newSession(this, response);
        }

        // Session with given sessionId not found case
        if (!this.sessionStorage[sessionId]) {
            return newSession(this, response);
        }

        // Session found successfully case
        // Return session with given sessionId
        return this.sessionStorage[sessionId];
    }

    public get(sessionId: string): Session | undefined {
        return this.sessionStorage[sessionId];
    }

    public create(): [string, Session] {
        // Generate new id
        const id: string = SimpleSessionFactory.generateId();

        // Create new session for given id
        this.sessionStorage[id] = new Session();

        // Returning
        return [ id, this.sessionStorage[id] ];
    }

    public clear(sessionId: string): void {
        // Session with given id not exist case
        if (!this.sessionStorage[sessionId]) {
            throw new Error(`Session with given ID "${sessionId}" doesn't exist!`);
        }

        // Clear session with given session id
        this.sessionStorage[sessionId] = undefined as any;
    }
}

type SessionStorage = { [ index: string ]: Session };