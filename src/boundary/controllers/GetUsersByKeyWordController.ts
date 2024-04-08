import { request } from "http";
import DomainManager from "../../domain/DomainManager";
import User from "../../domain/entities/User";
import Converter from "../../utils/interfaces/Converter";
import UserInfo from "../infos/user/UserInfo";
import QueryUserRestfulController from "./abstracts/QueryUserRestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";

export default class GetUsersByKeyWordController extends QueryUserRestfulController{
    //constructor
    public constructor(
        useInfoConverter : Converter<User,UserInfo>,
        domainManager?: DomainManager|undefined
     ){
        super(useInfoConverter,domainManager);
    }
    //External App gửi yêu cầu tìm kiếm người dùng kèm theo từ khóa truy vấn đến hệ thống.
    public async execute({request,response}: RestfulControllerParam): Promise<void> {
       const keyword : string | undefined = request.query.keyword as string | undefined;

       if(!keyword){
            response.json(
                {
                    success: false,
                    message: "keyword is required!",
                    code: "KEYWORD_REQUIRED"
                }
            );

            return;
       }

       const self : GetUsersByKeyWordController = this;
       //Cơ sở dữ liệu tiến hành truy vấn danh sách tất cả người dùng và phản hồi kết quả truy vấn cho hệ thống.
       try {
            var user : User[] = await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.searchUsers(keyword);
                    
                }
            )
       } catch (error) {
            console.error(error);

            response.json(
                {
                    success : false,
                    message :"Failed while handling with DB",
                    code :"HANDLING_DB_FAILED" 
                }
            );
            return;

       }

       //Hệ thống phản hồi về External App với trạng thái thành công kèm theo danh sách người dùng sau khi lọc
       response.json(
        {
            success : true,
            result : user.map(
                function(user : User):UserInfo{
                    return self.userInfoConverter.convert(user);
                }
            )
        }
       );
   }
    
}