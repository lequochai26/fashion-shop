import User from "../../../domain/entities/upgrade/User";
import DomainManager from "../../../domain/upgrade/DomainManager";
import AsyncConverter from "../../../utils/interfaces/AsyncConverter";
import UserInfo from "../../infos/user/UserInfo";
import QueryUserRestfulController from "../abstracts/upgrade/QueryUserRestfulController";
import RestfulControllerParam from "../interfaces/RestfulControllerParam";

export default class GetUsersByKeyWordController extends QueryUserRestfulController{
    //constructor
    public constructor(
        useInfoConverter : AsyncConverter<User,UserInfo>,
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
            var users : User[] = await this.useDomainManager(
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

       const result: UserInfo[] = [];
       for (const user of users) {
        result.push(await this.userInfoConverter.convert(user));
       }

       //Hệ thống phản hồi về External App với trạng thái thành công kèm theo danh sách người dùng sau khi lọc
       response.json(
        {
            success : true,
            result
        }
       );
   }
    
}