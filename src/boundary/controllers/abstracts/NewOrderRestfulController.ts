import DomainManager from "../../../domain/DomainManager";
import NewOrderValidateController from "../NewOrderValidateController";
import PermissionRequiredRestfulController from "../PermissionRequiredRestfulController";

export default abstract class NewOrderRestfulController extends PermissionRequiredRestfulController {
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