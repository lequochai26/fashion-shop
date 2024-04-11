import DomainManager from "../domain/DomainManager";
import Session from "../utils/Session";
import RestfulController from "./controllers/abstracts/RestfulController";
import Controller from "./controllers/interfaces/Controller";
import RestfulControllerParam from "./controllers/interfaces/RestfulControllerParam";
import RestfulControllerRequestDispatcher from "./RestfulControllerRequestDispatcher";

export default class RegisterController extends RestfulController {
    // Fields:
    private newUserController: Controller<RestfulControllerParam, void>;
    
    // Constructors:
    public constructor(
        newUserController: Controller<RestfulControllerParam, void>,
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);

        this.newUserController = newUserController;
    }

    // Methods:
    public async execute({ request, response }: RestfulControllerParam): Promise<void> {
        // Get session
        const session: Session = (request as any).session;

        // Check logged in
        if (session.get("user")) {
            response.json({
                success: false,
                message: "Already logged in!",
                code: "ALREADY_LOGGED_IN"
            });
            return;
        }

        // Check permission
        if (request.body.permission) {
            delete request.body.permission;
        }

        // Get dispatcher
        const dispatcher: RestfulControllerRequestDispatcher = (request as any).restfulControllerRequestDispatcher;

        // Dispatch
        return dispatcher.dispatch(this, this.newUserController, request, response);
    }
}