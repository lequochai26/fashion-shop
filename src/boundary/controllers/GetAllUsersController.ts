import UserInfo from "../infos/user/UserInfo";
import DomainManager from "../../domain/DomainManager";
import User from "../../domain/entities/User";
import QueryUserRestfulController from "./abstracts/QueryUserRestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";
import Converter from "../../utils/interfaces/Converter";

export default class GetAllUsersController extends QueryUserRestfulController{
    //Constructor
    public constructor(
        userInfoConverter: Converter<User,UserInfo>,
        domainManager?: DomainManager | undefined){
        super(userInfoConverter,domainManager);
    }
    
    
    public async execute({ response }: RestfulControllerParam): Promise<void> {
        //self tham chiếu GetAllUsersController
        const self: GetAllUsersController = this;

        //path
        const path: any[] = [];

        //lấy danh sách người dùng 
        try{
            var users: User[] = await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.getAllUsers(path); 
                }
            )
        }catch(error){
            console.error(error);
            
            response.json({
                success: false,
                message:" Failed while handling with DB!",
                code: "HANDLING_DB_FAILDE"
            });
            return;
        }

        //Trả về danh sách người dùng
        response.json({
            success: true,
            result: users.map(function(user: User): UserInfo{
                return self.userInfoConverter.convert(user);
            })
        })
    }
    
}