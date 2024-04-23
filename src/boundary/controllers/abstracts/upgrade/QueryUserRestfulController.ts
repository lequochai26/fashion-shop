import User from "../../../../domain/entities/upgrade/User";
import DomainManager from "../../../../domain/upgrade/DomainManager";
import AsyncConverter from "../../../../utils/interfaces/AsyncConverter";
import UserInfo from "../../../infos/user/UserInfo";
import PermissionRequiredRestfulController from "./PermissionRequiredRestfulController";

export default abstract class QueryUserRestfulController extends PermissionRequiredRestfulController {
    // Fields:
    protected userInfoConverter: AsyncConverter<User, UserInfo>;

    // Constructors:
    public constructor(
        userInfoConverter: AsyncConverter<User, UserInfo>,
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);
        this.userInfoConverter = userInfoConverter;
    }
}