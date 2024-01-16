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