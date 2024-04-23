import User from "../../../domain/entities/upgrade/User";
import DomainManager from "../../../domain/upgrade/DomainManager";
import AsyncConverter from "../../../utils/interfaces/AsyncConverter";
import Session from "../../../utils/Session";
import UserInfo from "../../infos/user/UserInfo";
import QueryUserRestfulController from "../abstracts/upgrade/QueryUserRestfulController";
import RestfulControllerParam from "../interfaces/RestfulControllerParam";

export default class GetThirdPartyAccountController extends QueryUserRestfulController {
    // Constructors:
    public constructor(
        userInfoConverter: AsyncConverter<User, UserInfo>,
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
            result: user && await this.userInfoConverter.convert(user)
        });
    }
}