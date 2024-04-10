import DomainManager from "../../domain/DomainManager";
import User from "../../domain/entities/User";
import RestfulController from "./abstracts/RestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";

export default class RemoveUserController extends RestfulController{
    //constructor:
    public constructor(domainManager?: DomainManager|undefined){
        super(domainManager);
    }
    
    public async execute({request,response}: RestfulControllerParam): Promise<void> {
       //email
       const email : string | undefined = request.body.email;

       if(!email){
        response.json(
            {
                success : false,
                message : "email parameter is requiresd!",
                code: "EMAIL_REQUIRED"
            }
        );

        return;
       }

       //path
       const path : any[] =[];

       let user : User | undefined;
       try {
        user = await this.useDomainManager(
            async function (domainManager ){
                return domainManager.getUser(email,path);
            }
        )
       } catch (error) {
         console.error(error);

         response.json(
            {
                success: false,
                message: "Failed while handling with DB!",
                code: "HANDLING_DB_FAILED"
            }
         );
         return;
       }
       //check user
       if(!user){
        response.json(
            {
                success: false,
                message: "User not exist!",
                code: "USER_NOT_EXIST"
            }
        );

        return;
       }
       //check order

       if(user.OrderedOrders.length > 0 ){
        response.json(
            {
                success: false,
                message: "Make sure no Order linked to this user!",
                code: "ORDER_LINKED"
            }
        );
        return;
       }

       //delete user
       try {
        await this.useDomainManager(
            async function (domainManager) {
                return domainManager.removeUser(user as User)
            }
        );
       } catch (error) {
          console.error(error);

          response.json(
            {
                success: false,
                message: "Failed while handling with DB!",
                code: "HANDLING_DB_FAILED"
            }
        );

        return;
       }

       //delete avatar user
       let avatarUser : string = user.Avatar as string;

       if(!avatarUser){
        try {
            await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.deleteFile(`.${user?.Avatar}`)
                }
            )
        } catch (error) {
            console.error(error);
        }
       }

       //session
       
       

       //

    }
    
}