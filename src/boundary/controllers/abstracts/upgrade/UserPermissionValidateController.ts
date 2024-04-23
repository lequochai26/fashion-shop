import DomainManager from "../../../../domain/upgrade/DomainManager";
import DomainManagerHolder from "../../base_classes/upgrade/DomainManagerHolder";
import Controller from "../../interfaces/Controller";
import LoginValidateController, { LoginValidateParam, LoginValidatePath } from "../../upgrade/LoginValidateController";

export default abstract class UserPermissionValidateController extends DomainManagerHolder implements Controller<LoginValidateParam, UserPermissionValidatePath> {
    // Fields:
    protected loginValidateController: Controller<LoginValidateParam, LoginValidatePath>;

    // Constructors:
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);

        this.loginValidateController = new LoginValidateController(domainManager);
    }

    // Methods:
    public abstract execute(param: LoginValidateParam): Promise<UserPermissionValidatePath>;
}

export interface UserPermissionValidatePath extends LoginValidatePath {
    permission: string;
}