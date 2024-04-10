import DomainManager from "../../../domain/DomainManager";
import DomainManagerHolder from "../base_classes/DomainManagerHolder";
import Controller from "../interfaces/Controller";
import LoginValidateController, { LoginValidateParam, LoginValidatePath } from "../LoginValidateController";

export default abstract class UserPermissionValidateController<R> extends DomainManagerHolder implements Controller<LoginValidateParam, R> {
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
    public abstract execute(param: LoginValidateParam): Promise<R>;
}