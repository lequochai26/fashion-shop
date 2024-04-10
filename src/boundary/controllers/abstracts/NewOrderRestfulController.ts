import DomainManager from "../../../domain/DomainManager";
import NewOrderValidateController from "../NewOrderValidateController";
import RestfulController from "./RestfulController";

export default abstract class NewOrderRestfulController extends RestfulController {
    // Static fields:
    private static newOrderValidateController: NewOrderValidateController;

    private static getNewOrderValidateController(domainManager?: DomainManager | undefined) {
        if (!NewOrderRestfulController.newOrderValidateController) {
            NewOrderRestfulController.newOrderValidateController = new NewOrderValidateController(domainManager);
        }

        return NewOrderRestfulController.newOrderValidateController;
    }

    // Fields:
    protected validateController: NewOrderValidateController;

    // Constructors:
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);
        this.validateController = NewOrderRestfulController.getNewOrderValidateController(domainManager);
    }
}