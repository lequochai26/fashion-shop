import DomainManager from "../../domain/DomainManager";
import UserPermission from "../../domain/enums/UserPermission";
import RestfulError from "../errors/RestfulError";
import UserPermissionValidateController from "./abstracts/UserPermissionValidateController";
import { LoginValidateParam, LoginValidatePath } from "./LoginValidateController";

export default class ManagerValidateController extends UserPermissionValidateController<ManagerValidatePath> {
    // Constructors:
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);
    }

    // Methods:
    public async execute(param: LoginValidateParam): Promise<ManagerValidatePath> {
        // Validate login
        const loginValidatePath = await this.loginValidateController.execute(param);

        // Get user from loginValidatePath
        const { user } = loginValidatePath;

        // Get user's permission
        const permission: string = user.Permission as string;

        // Permission not manager
        if (permission !== UserPermission.MANAGER) {
            throw new RestfulError(
                "Manager permission is required!",
                "MANAGER_PERMISSION_REQUIRED"
            );
        }

        // Return
        return { ...loginValidatePath, permission }
    }
}

export interface ManagerValidatePath extends LoginValidatePath {
    permission: string;
}