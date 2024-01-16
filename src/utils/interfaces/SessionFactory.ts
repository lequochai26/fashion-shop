import Session from "../Session";

export default interface SessionFactory {
    get(sessionId: string, createIfUndefined?: boolean): [ string, Session ] | undefined;
    create(sessionId: string): Session;
    create(): [ string, Session ];
    clear(sessionId: string): void;
}