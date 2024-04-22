import DomainManager from "../../../domain/upgrade/DomainManager";
import Controller from "../../controllers/interfaces/Controller";
import RestfulControllerParam from "../../controllers/interfaces/RestfulControllerParam";
import InvalidMethodController from "../../controllers/InvalidMethodController";
import MethodUnimplementedController from "../../controllers/MethodUnimplementedController";
import DefaultRequestHandler from "../DefaultRequestHandler";

export default class RestfulApi extends DefaultRequestHandler {
    // Static fields:
    private static invalidMethodController: Controller<RestfulControllerParam, void> = new InvalidMethodController();
    private static methodUnimplmentedController: Controller<RestfulControllerParam, void> = new MethodUnimplementedController();

    // Fields:
    protected domainManager?: DomainManager | undefined;
    protected invalidMethodController: Controller<RestfulControllerParam, void>;
    protected methodUnimplementedController: Controller<RestfulControllerParam, void>;

    // Constructor:
    public constructor(
        path: string,
        domainManager?: DomainManager | undefined
    ) {
        super(path);

        this.path = path;
        this.domainManager = domainManager;
        this.invalidMethodController = RestfulApi.invalidMethodController;
        this.methodUnimplementedController = RestfulApi.methodUnimplmentedController;
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