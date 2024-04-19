import DomainManager from "../../domain/DomainManager";
import User from "../../domain/entities/User";
import Session from "../../utils/Session";
import RestfulController from "./abstracts/RestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";

export default class CancelThirdPartyAccountRegistrationController extends RestfulController {
    // Constructors:
    public constructor(domainManager?: DomainManager | undefined) {
        super(domainManager);
    }

    // Methods:
    public async execute({ request, response }: RestfulControllerParam): Promise<void> {
        // Get session
        const session: Session = (request as any).session;

        // Get third party account
        const user: User | undefined = session.get("thirdPartyAccount");

        // Not found case
        if (!user) {
            response.json({
                success: false,
                message: "Not found your thirdparty account!",
                code: "THIRDPARTY_ACCOUNT_NOT_FOUND"
            });
            return;
        }

        // Remove thirdparty account from session
        session.remove("thirdPartyAccount");

        // Response
        response.json({ success: true });
    }
}