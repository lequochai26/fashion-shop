import DomainManager from "../../domain/DomainManager";
import RestfulError from "../errors/RestfulError";
import RestfulControllerRequestDispatcher from "../RestfulControllerRequestDispatcher";
import Controller from "./interfaces/Controller";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";
import PermissionRequiredRestfulController from "./abstracts/PermissionRequiredRestfulController";

export default class UpdatePersonalInfoController extends PermissionRequiredRestfulController {
    // Fields:
    private updateUserController: Controller<RestfulControllerParam, void>;

    // Constructors:
    public constructor(
        updateUserController: Controller<RestfulControllerParam, void>,
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);

        this.updateUserController = updateUserController;
    }

    // Methods:
    public async execute({ request, response }: RestfulControllerParam): Promise<void> {
        // Pre-condition check
        const path: any[] = [];

        try {
            var { user } = await this.loginValidateController.execute({ request, path });

            response.locals.user = user;
            response.locals.path = path;
        }
        catch (error: any) {
            if (error instanceof RestfulError) {
                response.json({
                    success: false,
                    message: error.message,
                    code: error.Code
                });
            }
            else {
                response.json({
                    success: false,
                    message: "Failed while handling with DB!",
                    code: "HANDLING_DB_FAILED"
                });
            }
            return;
        }

        // Remove permission from request's body if have
        if (request.body.permission) {
            delete request.body.permission;
        }

        // Dispatch request
        const dispatcher: RestfulControllerRequestDispatcher = (request as any).restfulControllerRequestDispatcher;

        return dispatcher.dispatch(this, this.updateUserController, request, response);
    }
}