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

    // Methods:
    public abstract execute(param: RestfulControllerParam): Promise<void>;
}