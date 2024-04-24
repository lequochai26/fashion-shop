import UserPermission from "../../../domain/enums/UserPermission";
import DomainManager from "../../../domain/upgrade/DomainManager";
import RestfulError from "../../errors/RestfulError";
import PermissionRequiredRestfulController from "../abstracts/upgrade/PermissionRequiredRestfulController";
import RestfulControllerParam from "../interfaces/RestfulControllerParam";

export default class ValidatePageAccessController extends PermissionRequiredRestfulController {
    // Static fields:
    public static pages: { [ index: string ]: UserPermission } = {
        '/itemmanagement': UserPermission.MANAGER,
        '/usermanagement': UserPermission.MANAGER,
        '/itemtypemanagement': UserPermission.MANAGER
    }

    // Constructors:
    public constructor(domainManager?: DomainManager | undefined) {
        super(domainManager);
    }

    // Methods:
    public async execute({ request, response }: RestfulControllerParam): Promise<void> {
        // Get path query
        const path: string | undefined = request.query.path as string | undefined;

        // Path not found case
        if (!path) {
            response.json({
                success: false,
                message: "path parameter is reuqired!",
                code: "PATH_REQUIRED"
            });
            return;
        }

        // Validating
        const pages = ValidatePageAccessController.pages;
        if (pages[path] === UserPermission.CUSTOMER) {
            try {
                await this.loginValidateController.execute({ request, path: [] });
            }
            catch (error: any) {
                if (error instanceof RestfulError) {
                    response.json({ success: true, result: false });
                }
                else {
                    console.error(error);
                    response.json({
                        success: false,
                        message: "Failed while handling with DB!",
                        code: "HANDLING_DB_FAILED"
                    });
                }
                return;
            }
        }

        if (pages[path] === UserPermission.EMPLOYEE) {
            try {
                await this.employeeValidateController.execute({ request, path: [] });
            }
            catch (error: any) {
                if (error instanceof RestfulError) {
                    response.json({ success: true, result: false });
                }
                else {
                    console.error(error);
                    response.json({
                        success: false,
                        message: "Failed while handling with DB!",
                        code: "HANDLING_DB_FAILED"
                    });
                }
                return;
            }
        }

        if (pages[path] === UserPermission.MANAGER) {
            try {
                await this.managerValidateController.execute({ request, path: [] });
            }
            catch (error: any) {
                if (error instanceof RestfulError) {
                    response.json({ success: true, result: false });
                }
                else {
                    console.error(error);
                    response.json({
                        success: false,
                        message: "Failed while handling with DB!",
                        code: "HANDLING_DB_FAILED"
                    });
                }
                return;
            }
        }

        // Success response
        response.json({ success: true, result: true });
    }
}