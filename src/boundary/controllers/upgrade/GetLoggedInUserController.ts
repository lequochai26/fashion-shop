import User from "../../../domain/entities/upgrade/User";
import DomainManager from "../../../domain/upgrade/DomainManager";
import AsyncConverter from "../../../utils/interfaces/AsyncConverter";
import RestfulError from "../../errors/RestfulError";
import UserInfo from "../../infos/user/UserInfo";
import QueryUserRestfulController from "../abstracts/upgrade/QueryUserRestfulController";
import RestfulControllerParam from "../interfaces/RestfulControllerParam";

export default class GetLoggedInUserController extends QueryUserRestfulController {
    //constructor:
    public constructor(
        userInfoConverter: AsyncConverter<User, UserInfo>,
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
                result: await this.userInfoConverter.convert(user)
            }
        );
    }
}