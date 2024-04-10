import DomainManager from "../../domain/DomainManager";
import UserPermission from "../../domain/enums/UserPermission";
import RestfulError from "../errors/RestfulError";
import UserPermissionValidateController, { UserPermissionValidatePath } from "./abstracts/UserPermissionValidateController";
import { LoginValidateParam, LoginValidatePath } from "./LoginValidateController";

export default class EmployeeValidateController extends UserPermissionValidateController {
    // Constructors:
    public constructor(
        domainManager: DomainManager | undefined
    ) {
        super(domainManager);
    }

    // Methods:
    public async execute(param: LoginValidateParam): Promise<UserPermissionValidatePath> {
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