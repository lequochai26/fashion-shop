import DomainManager from "../../domain/DomainManager";
import User from "../../domain/entities/User";
import Converter from "../../utils/interfaces/Converter";
import Session from "../../utils/Session";
import UserInfo from "../infos/user/UserInfo";
import QueryUserRestfulController from "./abstracts/QueryUserRestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";

export default class GetThirdPartyAccountController extends QueryUserRestfulController {
    // Constructors:
    public constructor(
        userInfoConverter: Converter<User, UserInfo>,
        domainManager?: DomainManager | undefined
    ) {
        super(
            userInfoConverter, domainManager
        );
    }

    // Methods:
    public async execute({ request, response }: RestfulControllerParam): Promise<void> {
        // Get session
        const session: Session = (request as any).session;

        // Get thirdparty account
        const user: User | undefined = session.get("thirdPartyAccount");

        // Response
        response.json({
            success: true,
            result: user && this.userInfoConverter.convert(user)
        });
    }
}