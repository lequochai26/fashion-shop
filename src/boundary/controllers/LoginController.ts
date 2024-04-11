import DomainManager from "../../domain/DomainManager";
import User from "../../domain/entities/User";
import Session from "../../utils/Session";
import RestfulController from "./abstracts/RestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";

export default class LoginController extends RestfulController {
    //Constructor:
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);
    }

    //Method:
    public async execute( { request, response }: RestfulControllerParam): Promise<void> {
        // Get session
        const session: Session = (request as any).session;

        // Check already logged-in
        if (session.get("user")) {
            response.json({
                success: false,
                message: "Already logged in!",
                code: "ALREADY_LOGGED_IN"
            });
            return;
        }

        //Get email and password
        const email: string | undefined = request.body.email;

        if(!email) {
            response.json(
                {
                    success: false,
                    message: "Email parameter is required!",
                    code: "EMAIL_REQUIRED"
                }
            );

            return;
        }

        const password: string | undefined = request.body.password;

        if(!password) {
            response.json(
                {
                    success: false,
                    message:"Password parameter is required!",
                    code: "PASSWORD_REQUIRED"
                }
            );

            return;
        }
        
        //Path initialazation
        const path : any[] = [];

        let user: User | undefined;
        try {
            user = await this.useDomainManager(
                async function(domainManager) {
                    return domainManager.getUser(email, path);
                }
            )
        } catch (error: any) {
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
                    message: "Incorrect email or password!",
                    code: "INCORRECT_EMAIL_PASSWORD"
                }
            );
            
            return;
        }

        if(user.Password !== password) {
            response.json(
                {
                    success: false,
                    message: "Incorrect email or password!",
                    code: "INCORRECT_EMAIL_PASSWORD"
                }
            );
            
            return;
        }
        
        session.put("user", user.Email);

        response.json(
            {
                success: true,
            }
        );
    }
}