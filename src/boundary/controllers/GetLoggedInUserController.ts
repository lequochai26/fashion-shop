import DomainManager from "../../domain/DomainManager";
import RestfulError from "../errors/RestfulError";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";
import PermissionRequiredRestfulController from "./PermissionRequiredRestfulController";

export default class GetLoggedInUserController extends PermissionRequiredRestfulController {
    //constructor:
    public constructor(
        domainManager?: DomainManager | undefined
    ){
        super(domainManager)
    }

    //method:
    public async execute( { request, response }: RestfulControllerParam): Promise<void> {
        //Path initialazation
        const path: any[] = [];
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

        response.json(
            {
                success: true,
                result: user
            }
        );
    }
}