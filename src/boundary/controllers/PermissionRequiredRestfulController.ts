import DomainManager from "../../domain/DomainManager";
import RestfulController from "./abstracts/RestfulController";
import { UserPermissionValidatePath } from "./abstracts/UserPermissionValidateController";
import EmployeeValidateController from "./EmployeeValidateController";
import Controller from "./interfaces/Controller";
import LoginValidateController, { LoginValidateParam, LoginValidatePath } from "./LoginValidateController";

export default abstract class PermissionRequiredRestfulController extends RestfulController {
    // Fields:
    protected loginValidateController: Controller<LoginValidateParam, LoginValidatePath>;
    protected employeeValidateController: Controller<LoginValidateParam, UserPermissionValidatePath>;
    protected managerValidateController: Controller<LoginValidateParam, UserPermissionValidatePath>;

    // Constructors:
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);

        this.loginValidateController = new LoginValidateController(domainManager);

        this.employeeValidateController = new EmployeeValidateController(domainManager);

        this.managerValidateController = new EmployeeValidateController(domainManager);
    }
}