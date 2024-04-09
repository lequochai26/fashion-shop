import DomainManager from "../../domain/DomainManager";
import User from "../../domain/entities/User";
import Session from "../../utils/Session";
import RestfulController from "./abstracts/RestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";

export default class GetLoggedInUserController extends RestfulController {
    //constructor:
    public constructor(
        domainManager?: DomainManager | undefined
    ){
        super(domainManager)
    }

    //method:
    public async execute( { request, response }: RestfulControllerParam): Promise<void> {
        const session: Session = (request as any).session;
        const email = session.get("user");

        if(!email) {
            response.json(
                {
                    success: false,
                    message: "Not logged in",
                    code: "NOT_LOGGED_IN"
                }
            );

            return;
        }
        
        let user : User | undefined;
        const path: any[] = [];
        try {
            user = await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.getUser(email,path);
                }
            );
        } catch (error: any) {
            console.error(error);

            response.json(
                {
                    success: false,
                    message: "Failed while handling with DB!",
                    code: "HANDLING_DB_FAILED"
                }
            );

            return;
        }

        if(!user) {
            response.json(
                {
                    success: false,
                    message: "User not exist",
                    code: "USER_NOT_EXIST"
                }
            );

            return;
        }

        response.json(
            {
                success: true,
                result: user
            }
        );
    }
}