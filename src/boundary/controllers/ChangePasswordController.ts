import DomainManager from "../../domain/DomainManager";
import User from "../../domain/entities/User";
import SessionFactory from "../../utils/interfaces/SessionFactory";
import Session from "../../utils/Session";
import RestfulError from "../errors/RestfulError";
import RestfulController from "./abstracts/RestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";
import PermissionRequiredRestfulController from "./PermissionRequiredRestfulController";

export default class ChangePasswordController extends PermissionRequiredRestfulController {
    //Constructor:  
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);
    }

    public async execute({ request, response }: RestfulControllerParam): Promise<void> {
        //Path initialazation
        const path: any[] = [];

        //Validate
        try {
            var { user } = await this.loginValidateController.execute({ request, path});
        } catch (error: any) {
            if(error instanceof RestfulError) {
                response.json(
                    {
                        success: false,
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
            if(session.get("user") === user.Email) {
                session.remove("user");
            }
        }
        
        response.json(
            { success: true }
        );
    }
}