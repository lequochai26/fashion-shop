import DomainManager from "../../../domain/DomainManager";
import User from "../../../domain/entities/User";
import Converter from "../../../utils/interfaces/Converter";
import UserInfo from "../../infos/user/UserInfo";
import PermissionRequiredRestfulController from "../PermissionRequiredRestfulController";

export default abstract class QueryUserRestfulController extends PermissionRequiredRestfulController {
    // Fields:
    protected userInfoConverter: Converter<User, UserInfo>;

    // Constructors:
    public constructor(
        userInfoConverter: Converter<User, UserInfo>,
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);
        this.userInfoConverter = userInfoConverter;
    }
}