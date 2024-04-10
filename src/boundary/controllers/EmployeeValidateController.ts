import DomainManager from "../../domain/DomainManager";
import UserPermission from "../../domain/enums/UserPermission";
import RestfulError from "../errors/RestfulError";
import UserPermissionValidateController from "./abstracts/UserPermissionValidateController";
import DomainManagerHolder from "./base_classes/DomainManagerHolder";
import Controller from "./interfaces/Controller";
import { LoginValidateParam, LoginValidatePath } from "./LoginValidateController";

export default class EmployeeValidateController extends UserPermissionValidateController<EmployeeValidatePath> {
    // Constructors:
    public constructor(
        domainManager: DomainManager | undefined
    ) {
        super(domainManager);
    }

    // Methods:
    public async execute(param: LoginValidateParam): Promise<EmployeeValidatePath> {
        // Validate login
        const loginValidatePath: LoginValidatePath = await this.loginValidateController.execute(param);

        // Get user from loginValidatePath
        const { user } = loginValidatePath;

        // Get user's permission
        const permission: string = user.Permission as string;

        // Check user's permission
        if (permission !== UserPermission.EMPLOYEE) {
            throw new RestfulError(
                "Employee permission required!",
                "EMPLOYEE_PERMISSION_REQUIRED"
            );
        }

        // Return
        return { ...loginValidatePath, permission };
    }
}

export interface EmployeeValidatePath extends LoginValidatePath {
    permission: string;
}