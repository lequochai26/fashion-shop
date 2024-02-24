import PersistenceHandler from "../persistence/PersistenceHandler";
import VerificationCodeData from "../persistence/data/VerificationCodeData";
import VerificationCodePrimaryKey from "../persistence/pkeys/VerificationCodePrimaryKey";
import ReversableConverter from "../utils/interfaces/ReversableConverter";
import EntityManager from "./EntityManager";
import PersistenceHandlerHolder from "./PersistenceHandlerHolder";
import User from "./entities/User";
import VerificationCode from "./entities/VerificationCode";

export default class VerificationCodeManager extends PersistenceHandlerHolder implements EntityManager<VerificationCode, VerificationCodePrimaryKey> {
    // Fields:
    private verificationCodeConverter?: ReversableConverter<VerificationCodeData, VerificationCode> | undefined;
    private userManager?: EntityManager<User, string> | undefined;

    // Constructor:
    public constructor(
        persistenceHandler?: PersistenceHandler | undefined,
        verificationCodeConverter?: ReversableConverter<VerificationCodeData, VerificationCode> | undefined,
        userManager?: EntityManager<User, string> | undefined
    ) {
        super(persistenceHandler);

        this.verificationCodeConverter = verificationCodeConverter;
        this.userManager = userManager;
    }

    // Private methods:
    protected async usePersistenceHandler<T>(
        executable: (persistenceHandler: PersistenceHandler) => Promise<T>
    ): Promise<T> {
        if (!this.persistenceHandler) {
            throw new Error("persistenceHandler field is missing!");
        }

        return executable(this.persistenceHandler);
    }

    private useVerificationCodeConverter<T>(
        executable: (verificationCodeConverter: ReversableConverter<VerificationCodeData, VerificationCode>) => T
    ): T {
        if (!this.verificationCodeConverter) {
            throw new Error("verificationCodeConverter field is missing!");
        }

        return executable(this.verificationCodeConverter);
    }

    private async useUserManager<T>(
        executable: (userManager: EntityManager<User, string>) => Promise<T>
    ): Promise<T> {
        if (!this.userManager) {
            throw new Error("userManager field is missing!");
        }

        return executable(this.userManager);
    }

    private precheckPath(pKey: VerificationCodePrimaryKey, path: any[]): VerificationCode | undefined {
        for (const obj of path) {
            if (obj instanceof VerificationCode) {
                if (obj.User?.Email === pKey.email && obj.Code === pKey.code) {
                    return obj;
                }
            }
        }
    }

    private async setupDependencies(entity: VerificationCode, path: any[]): Promise<void> {
        // User dependency
        entity.User = await this.useUserManager(
            async function (userManager) {
                return userManager.get(entity.User?.Email as string, path);
            }
        )
    }

    // Methods:
    public async get(pKey: VerificationCodePrimaryKey, path: any[]): Promise<VerificationCode | undefined> {
        // Precheck path
        let entity: VerificationCode | undefined = this.precheckPath(pKey, path);

        if (entity) {
            return entity;
        }

        // Get data
        const data: VerificationCodeData | undefined = await this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.getVerificationCode(pKey);
            }
        );

        // Data not found case
        if (!data) {
            return;
        }

        // Data found case
        // Convert data to entity
        entity = this.useVerificationCodeConverter(
            function (verificationCodeConverter) {
                return verificationCodeConverter.convert(data);
            }
        );

        // Push entity into path after converted
        path.push(entity);

        // Setup dependencies for entity
        this.setupDependencies(entity, path);

        // Return entity
        return entity;
    }

    getAll(path: any[]): Promise<VerificationCode[]> {
        throw new Error("Method not implemented.");
    }

    getByFilter(filter: any, path: any[]): Promise<VerificationCode[]> {
        throw new Error("Method not implemented.");
    }

    insert(target: VerificationCode): Promise<void> {
        throw new Error("Method not implemented.");
    }

    update(target: VerificationCode): Promise<void> {
        throw new Error("Method not implemented.");
    }

    remove(target: VerificationCode): Promise<void> {
        throw new Error("Method not implemented.");
    }

    removeByPrimaryKey(pKey: VerificationCodePrimaryKey): Promise<void> {
        throw new Error("Method not implemented.");
    }

    // Getters / setters:
    public get VerificationCodeConverter(): ReversableConverter<VerificationCodeData, VerificationCode> | undefined {
        return this.verificationCodeConverter;
    }

    public set VerificationCodeConverter(value: ReversableConverter<VerificationCodeData, VerificationCode> | undefined) {
        this.verificationCodeConverter = value;
    }

    public get UserManager(): EntityManager<User, string> | undefined {
        return this.userManager;
    }

    public set UserManager(value: EntityManager<User, string> | undefined) {
        this.userManager = value;
    }

}