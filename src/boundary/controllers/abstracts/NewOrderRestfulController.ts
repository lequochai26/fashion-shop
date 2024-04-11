import DomainManager from "../../../domain/DomainManager";
import NewOrderValidateController from "../NewOrderValidateController";
import RestfulController from "./RestfulController";

export default abstract class NewOrderRestfulController extends RestfulController {
    // Fields:
    protected validateController: NewOrderValidateController;

    // Constructors:
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);
        this.validateController = new NewOrderValidateController(domainManager);
    }
}