import DomainManager from "../../domain/DomainManager";
import User from "../../domain/entities/User";
import Converter from "../../utils/interfaces/Converter";
import RestfulError from "../errors/RestfulError";
import UserInfo from "../infos/user/UserInfo";
import QueryUserRestfulController from "./abstracts/QueryUserRestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";
import PermissionRequiredRestfulController from "./abstracts/PermissionRequiredRestfulController";

export default class GetLoggedInUserController extends QueryUserRestfulController {
    //constructor:
    public constructor(
        userInfoConverter: Converter<User, UserInfo>,
        domainManager?: DomainManager | undefined
    ){
        super(userInfoConverter, domainManager);
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
                result: this.userInfoConverter.convert(user)
            }
        );
    }
}