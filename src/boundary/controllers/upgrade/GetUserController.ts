import User from "../../../domain/entities/upgrade/User";
import DomainManager from "../../../domain/upgrade/DomainManager";
import AsyncConverter from "../../../utils/interfaces/AsyncConverter";
import UserInfo from "../../infos/user/UserInfo";
import QueryUserRestfulController from "../abstracts/upgrade/QueryUserRestfulController";
import RestfulControllerParam from "../interfaces/RestfulControllerParam";

export default class GetUserController extends QueryUserRestfulController {

    //Constructor
    public constructor(
        userInfoConverter: AsyncConverter<User, UserInfo>,
        domainManager?: DomainManager | undefined
    ) {
        super(userInfoConverter, domainManager)
    }

    //Methods
    public async execute({ response, request }: RestfulControllerParam): Promise<void> {

        //check email
        const email: string | undefined = request.query.email as string;

        if (!email) {
            response.json(
                {
                    success: false,
                    message: "email parameter is required!",
                    code: "EMAIL_REQUIRED"
                }
            );
            return;
        }
        //path
        const path: any = [] = [];

        try {
            var user: User | undefined =
                await this.useDomainManager( //This = Su dung useDomainManager trong GetItem
                    async function (useDomainManager) {
                        return useDomainManager.getUser(email, path)
                    }
                )
        } catch (error: any) {
            console.log(error);

            //Trong luong catch
            response.json(
                {
                    success: false,
                    message: "Failed while handling with DB!",
                    code: "HANDLING_DB_FAILED"
                }
            )
            return;
        }

        response.json(
            {
                success: true,
                result: user && await this.userInfoConverter.convert(user)
            }
        );
    }
}