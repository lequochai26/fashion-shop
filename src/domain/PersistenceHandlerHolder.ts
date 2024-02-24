import PersistenceHandler from "../persistence/PersistenceHandler";

export default class PersistenceHandlerHolder {
    // Fields:
    protected persistenceHandler?: PersistenceHandler | undefined;

    // Constructor:
    public constructor(persistenceHandler?: PersistenceHandler | undefined) {
        this.persistenceHandler = persistenceHandler;
    }

    // Methods:
    protected async usePersistenceHandler<T>(
        executable: (persistenceHandler: PersistenceHandler) => Promise<T>
    ): Promise<T> {
        if (!this.persistenceHandler) {
            throw new Error("persistenceHandler field is missing!");
        }

        return executable(this.persistenceHandler);
    }

    // Getters / setters:
    public get PersistenceHandler(): PersistenceHandler | undefined {
        return this.persistenceHandler;
    }

    public set PersistenceHandler(persistenceHandler: PersistenceHandler | undefined) {
        this.persistenceHandler = persistenceHandler;
    }
}