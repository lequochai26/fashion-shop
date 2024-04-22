import DomainManager from "../../domain/DomainManager";
import User from "../../domain/entities/User";
import UserPermission from "../../domain/enums/UserPermission";
import RestfulError from "../errors/RestfulError";
import RegisterController from "./RegisterController";
import Controller from "./interfaces/Controller";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";
import PermissionRequiredRestfulController from "./abstracts/PermissionRequiredRestfulController";
import Session from "../../utils/Session";
import Cart from "../../domain/Cart";

export class NewUserController extends PermissionRequiredRestfulController {
    //Constructor
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);
    }

    public async execute({ request, response }: RestfulControllerParam): Promise<void> {
        // Pre-condition validation
        const dispatchedFrom: Controller<RestfulControllerParam, void> = (request as any).dispatchedFrom;

        const path: any[] = [];

        if (!(dispatchedFrom instanceof RegisterController)) {
            try {
                await this.managerValidateController.execute({ request, path });
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

        const email: string | undefined = request.body.email;

        //Check email
        if (!email) {
            response.json(
                {
                    success: false,
                    message: "email parameter is required!",
                    code: "EMAIL_REQUIED"
                }
            );

            return;
        }

        const regexEmail = /^(?![-._]|.*@[-._]|.*[-._]+@)[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/

        if (!regexEmail.test(email)) {
            response.json(
                {
                    success: false,
                    message: "email invalid!",
                    code: "EMAIL_INVALID"
                }
            );

            return;
        }

        let user: User | undefined;

        try {
            user = await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.getUser(email, path);
                }
            )
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

        if (user) {
            response.json(
                {
                    success: false,
                    message: "User already exist!",
                    code: "USER_ALREADY_EXIST"
                }
            );

            return;
        }

        //Fullname
        const fullName: string | undefined = request.body.fullName;

        if (!fullName) {
            response.json(
                {
                    success: false,
                    message: "Fullname parameter is required!",
                    code: "FULLNAME_REQUIRED"
                }
            );

            return;
        }

        //Password
        const password: string | undefined = request.body.password;

        if (!password) {
            response.json(
                {
                    success: false,
                    message: "Password parameter is required!",
                    code: "PASSWORD_REQUIRED"
                }
            );

            return;
        }

        //Phone number
        const phoneNumber: string | undefined = request.body.phoneNumber;

        if (!phoneNumber) {
            response.json(
                {
                    success: false,
                    message: "PhoneNumber parameter is required!",
                    code: "PHONENUMBER_REQUIRED"
                }
            );

            return;
        }

        //Check phone number
        const regexPhoneNumber = /^(\+84\d{9,10})|0\d{9,10}$/;

        if (!regexPhoneNumber.test(phoneNumber)) {
            response.json(
                {
                    success: false,
                    message: "PhoneNumber invalid!",
                    code: "PHONENUMBER_INVALID"
                }
            );

            return;
        }

        //Address
        const address: string | undefined = request.body.address;

        if (!address) {
            response.json(
                {
                    success: false,
                    message: "Address parameter is required!",
                    code: "ADDRESS_REQUIRED"
                }
            );

            return;
        }

        //Gender
        const genderStr: string | undefined = request.body.gender;

        if (!genderStr) {
            response.json(
                {
                    success: false,
                    message: "Gender parameter is required!",
                    code: "GENDER_REQUIRED"
                }
            );

            return;
        }

        const gender: boolean = genderStr === "true";


        //Avatar
        const [avatar]: Express.Multer.File[] = this.getFiles(request, "avatar");

        let avatarPath: string;

        if (!avatar) {
            avatarPath = "/assets/avatar/default.png";
        } else {
            //Check avatar file type
            if (
                !await this.useDomainManager(
                    async function (domainManager) {
                        return domainManager.isImageFile(avatar);
                    }
                )
            ) {
                avatarPath = "/assets/avatar/default.png";
            } else {
                //Write avatar
                try {
                    const avatarFileName = await this.useDomainManager(
                        async function (domainManager) {
                            return domainManager.writeFileAutoName("./assets/avatar/", avatar);
                        }
                    );
                    avatarPath = `/assets/avatar/${avatarFileName}`;
                } catch (error: any) {
                    console.error(error);
                    avatarPath = "/assets/avatar/default.png";
                }
            }
        }

        //Permission
        let permission = request.body.permission;
        if (!permission) {
            permission = UserPermission.CUSTOMER;
        }

        if (!Object.values(UserPermission).includes(permission)) {
            permission = UserPermission.CUSTOMER;
        }


        //Insert user
        user = new User();
        user.Email = email;
        user.Password = password;
        user.FullName = fullName;
        user.Gender = gender;
        user.PhoneNumber = phoneNumber;
        user.Adress = address;
        user.Avatar = avatarPath;
        user.Permission = permission;

        try {
            await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.insertUser(user as User);
                }
            )
        } catch (error: any) {
            console.error(error);

            try {
                await this.useDomainManager(
                    async function (domainManager) {
                        domainManager.deleteFile(avatarPath);
                    }
                )
            } catch (error: any) {
                console.error(error);
            }

            response.json(
                {
                    success: false,
                    message: "Failed while handling with DB!",
                    code: "HANDLING_DB_FAILED"
                }
            );

            return;
        }

        // Cart handling
        if (dispatchedFrom instanceof RegisterController) {
            // Get session
            const session: Session = (request as any).session;

            // Get cart
            const cart: Cart | undefined = session.get("cart");

            // Cart exist case
            if (cart) {
                // Attach cart to given user
                try {
                    await cart.attach(user, path);
                }
                catch (error: any) {
                    console.error(error);
                }

                // Remove cart from session
                session.remove("cart");
            }
        }

        response.json(
            { success: true }
        );
    }
}