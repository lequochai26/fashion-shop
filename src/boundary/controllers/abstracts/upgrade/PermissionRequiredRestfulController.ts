import DomainManager from "../../../../domain/upgrade/DomainManager";
import Controller from "../../interfaces/Controller";
import EmployeeValidateController from "../../upgrade/EmployeeValidateController";
import LoginValidateController, { LoginValidateParam, LoginValidatePath } from "../../upgrade/LoginValidateController";
import ManagerValidateController from "../../upgrade/ManagerValidateController";
import RestfulController from "./RestfulController";
import { UserPermissionValidatePath } from "./UserPermissionValidateController";

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

        this.managerValidateController = new ManagerValidateController(domainManager);
    }
}