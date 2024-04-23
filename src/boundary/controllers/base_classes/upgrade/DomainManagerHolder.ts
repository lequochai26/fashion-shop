import DomainManager from "../../../../domain/upgrade/DomainManager";

export default class DomainManagerHolder {
    // Fields:
    protected domainManager?: DomainManager | undefined;

    // Constructors:
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        this.domainManager = domainManager;
    }

    // Protected methods:
    protected async useDomainManager<T>(
        executable: (domainManager: DomainManager) => Promise<T>
    ): Promise<T> {
        if (!this.domainManager) {
            throw new Error("domainManager field is missing!");
        }

        return executable(this.domainManager);
    }

    // Getters / setters:
    public get DomainManager(): DomainManager | undefined {
        return this.domainManager;
    }

    public set DomainManager(domainManager: DomainManager | undefined) {
        this.domainManager = domainManager;
    }
}