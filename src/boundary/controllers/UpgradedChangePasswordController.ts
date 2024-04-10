import PermissionRequiredRestfulController from "./PermissionRequiredRestfulController";
import DomainManager from "../../domain/DomainManager";
import User from "../../domain/entities/User";
import SessionFactory from "../../utils/interfaces/SessionFactory";
import Session from "../../utils/Session";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";
import RestfulError from "../errors/RestfulError";

export default class UpgradedChangePasswordController extends PermissionRequiredRestfulController {
    //Constructor:  
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);
    }

    public async execute({ request, response }: RestfulControllerParam): Promise<void> {
        //password
        const password: string | undefined = request.body.password;

        if(!password) {
            response.json(
                {
                    success: false,
                    message: "password parameter is required!",
                    code: "PASSWORD_REQUIRED"
                }
            );

            return;
        }

        //new password
        const newPassword: string | undefined = request.body.newPassword;

        if(!newPassword) {
            response.json(
                {
                    success: false,
                    message: "newPassword parameter is required!",
                    code: "NEWPASSWORD_REQUIRED"
                }
            );

            return;
        }

        //Path initialazation
        const path: any[] = [];

        try {
            var { user, email } = await this.loginValidateController.execute({ request, path});
        } catch (error: any) {
            if(error instanceof RestfulError) {
                response.json(
                    {
                        success:false,
                        message: error.message,
                        code: error.Code
                    }
                );

                return;
            } else {
                response.json(
                    {
                        success: false,
                        message: "Failed while handling with DB!",
                        code: "HANDLING_DB_FAILED"
                    }
                );

                return;
            }
        }

        //Check password
        if(user.Password !== password) {
            response.json(
                {
                    success: false,
                    message: "Password incorrect!",
                    code: "PASSWORD_INCORRECT"
                }
            );

            return;
        }

        //Update password
        user.Password = newPassword;
        
        try {
            await this.useDomainManager(
                async function(domainManager) {
                    return domainManager.updateUser(user as User);
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

        //Logout user 
        const sessionFactory: SessionFactory = (request as any).sessionFactory;
        const allSession : Session[] = sessionFactory.getAll();

        for(const session of allSession) {
            if(session.get("user") === email) {
                session.remove("user");
            }
        }
        
        response.json(
            { success: true }
        );
    }
}