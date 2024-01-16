import Session from "../Session";

export default interface SessionFactory {
    get(sessionId: string, createIfUndefined?: boolean): Session | undefined;
    create(sessionId: string): Session;
    clear(sessionId: string): void;
}