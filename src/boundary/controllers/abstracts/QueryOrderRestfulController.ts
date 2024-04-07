import DomainManager from "../../../domain/DomainManager";
import User from "../../../domain/entities/User";
import Converter from "../../../utils/interfaces/Converter";
import UserInfo from "../../infos/user/UserInfo";
import RestfulController from "./RestfulController";

export default abstract class QueryOrderRestfulController extends RestfulController {
    // Fields 
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