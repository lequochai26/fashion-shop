import User from "../../domain/entities/User";
import Converter from "../../utils/interfaces/Converter";
import QueryUserRestfulController from "./abstracts/QueryUserRestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";
import DomainManager from "../../domain/DomainManager";
import UserInfo from "../infos/user/UserInfo";

export default class GetUserController extends QueryUserRestfulController {

    //Constructor
    public constructor(
        userInfoConverter: Converter<User, UserInfo>,
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
                        message: "Failed while handling with DB!"
                    }
                )
                return;
            }
            response.json(
                {
                    success: true,
                    result: user && this.userInfoConverter.convert(user)
                }
            )
        }
    }
}