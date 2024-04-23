import User from "../../../domain/entities/upgrade/User";
import DomainManager from "../../../domain/upgrade/DomainManager";
import Session from "../../../utils/Session";
import PermissionRequiredRestfulController from "../abstracts/upgrade/PermissionRequiredRestfulController";
import RestfulControllerParam from "../interfaces/RestfulControllerParam";

// Constants:
const facebookAPIUrl: string = "https://graph.facebook.com/"

export default class LoginWithFacebookController extends PermissionRequiredRestfulController {
    // Constructors:
    public constructor(domainManager?: DomainManager | undefined) {
        super(domainManager);
    }

    // Methods:
    public async execute({ request, response }: RestfulControllerParam): Promise<void> {
        // Get session
        const session: Session = (request as any).session;

        // Logged in case
        if (session.get("user")) {
            response.json({
                success: false,
                message: "Already logged in!",
                code: "ALREADY_LOGGED_IN"
            });
            return;
        }

        // Access token
        const accessToken: string | undefined = request.body.accessToken;

        if (!accessToken) {
            response.json({
                success: false,
                message: "accessToken parameter is required!",
                code: "ACCESSTOKEN_REQUIRED"
            });
            return;
        }

        // Fetching to Facebook's Service
        try {
            var facebookResponse = await fetch(
                `${facebookAPIUrl}/me?access_token=${accessToken}&fields=email,first_name,last_name,picture.width(500).height(500)`
            );
        }
        catch (error) {
            console.error(error);
            response.json({
                success: false,
                message: "Failed to connect to Facebook!",
                code: "CONNECT_FACEBOOK_FAILED"
            });
            return;
        }

        // Parse faceBook response to json
        const body: any = await facebookResponse.json();

        // Failed case
        if (body.error) {
            response.json({
                success: false,
                message: "accessToken invalid!",
                code: "ACCESSTOKEN_INVALID"
            });
            return;
        }

        // Success case
        // Retrieving user's info
        const email: string = body.email;
        const firstName: string = body.first_name;
        const lastName: string = body.last_name;
        const avatar: string = body.picture.data.url;

        // Get user from db
        let user: User | undefined = undefined;
        try {
            user = await this.useDomainManager(
                async domainManager => domainManager.getUser(email, [])
            );
        }
        catch (error: any) {
            console.error(error);
            response.json({
                success: false,
                message: "Failed while handling with DB!",
                code: "HANDLING_DB_FAILED"
            });
            return;
        }

        // User not exist case
        if (!user) {
            // Create new user
            user = new User();

            // Assign information
            user.Email = email;
            user.FullName = `${lastName} ${firstName}`;
            user.Avatar = "/assets/avatar/default.png";

            // Store created user in session
            session.put("thirdPartyAccount", user);

            // Response
            response.json({
                success: true,
                code: "REGISTRATION_FINISH_AWAITING"
            });
            return;
        }

        // Login user into session
        session.put("user", email);

        // Response
        response.json({ success: true });
    }
}