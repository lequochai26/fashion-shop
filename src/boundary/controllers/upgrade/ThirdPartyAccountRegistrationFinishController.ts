import User from "../../../domain/entities/upgrade/User";
import DomainManager from "../../../domain/upgrade/DomainManager";
import Session from "../../../utils/Session";
import RestfulController from "../abstracts/upgrade/RestfulController";
import RestfulControllerParam from "../interfaces/RestfulControllerParam";

export default class ThirdPartyAccountRegistrationFinishController extends RestfulController {
    // Constructors:
    public constructor(domainManager?: DomainManager | undefined) {
        super(domainManager);
    }

    // Methods:
    public async execute({ request, response }: RestfulControllerParam): Promise<void> {
        // Get session
        const session: Session = (request as any).session;
        
        // Get thirdparty user
        const user: User | undefined = session.get("thirdPartyAccount");

        // Thirdparty user not found case
        if (!user) {
            response.json({
                success: false,
                message: "No thirdparty account found!",
                code: "NO_THIRDPARTY_ACCOUNT_FOUND"
            });
            return;
        }

        // password
        const password: string | undefined = request.body.password;

        if (!password) {
            response.json({
                success: false,
                message: "password parameter is required!",
                code: "PASSWORD_REQUIRED"
            });
            return;
        }

        // phoneNumber
        const phoneNumber: string | undefined = request.body.phoneNumber;

        if (!phoneNumber) {
            response.json({
                success: false,
                message: "phoneNumber parameter is required!",
                code: "PHONENUMBER_REQUIRED"
            });
            return;
        }

        const regexPhoneNumber = /^(\+84\d{9,10})|0\d{9,10}$/;
        if (!regexPhoneNumber.test(phoneNumber)) {
            response.json({
                success: false,
                message: "phoneNumber invalid!",
                code: "PHONENUMBER_INVALID"
            });
            return;
        }

        // Gender
        const gender: boolean | undefined = request.body.gender;

        if (gender === undefined) {
            response.json({
                success: false,
                message: "gender parameter is required!",
                code: "GENDER_REQUIRED"
            });
            return;
        }

        if (typeof(gender) !== 'boolean') {
            response.json({
                success: false,
                message: "gender must be a boolean!",
                code: "GENDER_MUST_BE_BOOLEAN"
            });
            return;
        }

        // Address
        const address: string | undefined = request.body.address;

        if (!address) {
            response.json({
                success: false,
                message: "address parameter is required!",
                code: "ADDRESS_REQUIRED"
            });
            return;
        }

        // Assign info for user
        user.PhoneNumber = phoneNumber;
        user.Gender = gender;
        user.Adress = address;

        // Insert into db
        try {
            await this.useDomainManager(
                async domainManager => domainManager.insertUser(user)
            );
        }
        catch (error: any) {
            response.json({
                success: false,
                message: "Failed while handling with DB!",
                code: "HANDLING_DB_FAILED"
            });
            return;
        }

        // Remove thirdparty account from session
        session.remove("thirdPartyAccount");

        // Login to session
        session.put("user", user.Email);

        // Response
        response.json({ success: true });
    }
}