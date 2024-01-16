import Session from "./Session";
import SessionFactory from "./interfaces/SessionFactory";

export default class SimpleSessionFactory implements SessionFactory {
    // Static methods:
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
    public get(sessionId: string, createIfUndefined?: boolean | undefined): Session | undefined {
        if (!this.sessionStorage[sessionId]) {
            if (createIfUndefined) {
                sessionStorage[sessionId] = {};
            }
        }

        return sessionStorage[sessionId];
    }

    public create(sessionId: string): Session {
        if (sessionStorage[sessionId]) {
            throw new Error(`Session with ID "${sessionId}" already exist!`);
        }

        sessionStorage[sessionId] = {};
        return sessionStorage[sessionId];
    }

    public clear(sessionId: string): void {
        if (!sessionStorage[sessionId]) {
            throw new Error(`Session with ID "${sessionId}" doesn't exist!`);
        }

        sessionStorage[sessionId] = undefined;
    }
}

type SessionStorage = { [ index: string ]: Session };