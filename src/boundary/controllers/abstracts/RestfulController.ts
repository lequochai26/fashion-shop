import DomainManager from "../../../domain/DomainManager";
import Controller from "../interfaces/Controller";
import RestfulControllerParam from "../interfaces/RestfulControllerParam";

export default abstract class RestfulController implements Controller<RestfulControllerParam, void> {
    // Fields:
    protected domainManager?: DomainManager | undefined;

    // Constructor:
    public constructor(domainManager?: DomainManager | undefined) {
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

    // Methods:
    public abstract execute(param: RestfulControllerParam): Promise<void>;
}