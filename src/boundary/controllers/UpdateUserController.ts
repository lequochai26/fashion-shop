import DomainManager from "../../domain/DomainManager";
import User from "../../domain/entities/User";
import UserPermission from "../../domain/enums/UserPermission";
import Session from "../../utils/Session";
import RestfulController from "./abstracts/RestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";

export default class UpdateUserController extends RestfulController{
    
    //construstor
    public constructor(domainManager?: DomainManager|undefined){
        super(domainManager);
    }

    //method
    public async execute({request,response}: RestfulControllerParam): Promise<void> {
        //nhung session vao request

        const session : Session = ( request as any).session;

        let email : string | undefined = request.body.email;

        if(!email){
            email = session.get("user");
            if(!email){
                response.json(
                    {
                        success : false,
                        message : "email parameter is required!",
                        code : "EMAIL_REQUIRED"
                    }
                );
                return;
            }
        }
        
        //path
           const path: any[] =[];
    
           //check user
           let user: User | undefined;
        try {
            user = await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.getUser(email, path);
                }
            );
        }
        catch (error: any) {
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
            
           if(!user){
               response.json(
                   {
                       success : false,
                       message : "User not exist!",
                       code : "USER_NOT_EXIST"
                    }
                );
                
                return;
            }
            
            //check name
            const fullName : string | undefined = request.body.fullName;
            
            if(!fullName){
                response.json(
                    {
                    success : false,
                    message : "FullName parameter is required !",
                    code : "FULLNAME_REQUIRED"
                }
            );
            return;
        }
        //phone
        
        const phoneNumber : string |undefined = request.body.phoneNumber;
        
        if(!phoneNumber){
            response.json(
                {
                    success : false,
                    message : "PhoneNumber parameter is required !",
                    code : "PHONENUMBER_REQUIRED"
                }
            );
            return;
        }
        
        const phoneCheck : RegExp = /^(0|\+84)(\d{9,10})$/;
        
        if(!phoneCheck.test(phoneNumber)){
            response.json(
                {
                    success : false,
                    message : "PhoneNumber invalid !",
                    code : "PHONENUMBER_INVALID!"
                }
            );
            return;
        }
        
        //gender
        
        const genderUser : string | undefined = request.body.gender;
        
        
        if(genderUser){
            const gender : boolean = genderUser === 'true';
            
            user.Gender = gender;
        }
        
        
        //check address
        const address : string | undefined = request.body.address;
       
        if(!address){
            response.json(
                {
                    success : false,
                    message : "Address parameter is required !",
                    code : "ADDRESS_REQUIRED"
                }
            );
            return;
        }
        
        //check permission
        let permission : any = request.body.permission;
    
        if(!permission){
            permission = UserPermission.CUSTOMER;
        }
    
        if (!Object.values(UserPermission).includes(permission)) {
            // Kiểm tra nếu permission không thuộc các giá trị hợp lệ của UserPermission
            permission = UserPermission.CUSTOMER;
        }
       
        // UserPermission.
    
        //check avatar
        let avatarUser : string = user.Avatar as string;
    
        const [avatar] : Express.Multer.File[] = this.getFiles(request,"avatar");
    
        if(avatar){
            
           
        }
        //update
        try {
            await this.useDomainManager(
                async function (domainManager) {
                    domainManager.updateUser(user as User);
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
    
        //update user avatar
        if(user.Avatar !== avatarUser){
            try {
                await this.useDomainManager(
                    async function (domainManager) {
                        domainManager.deleteFile(`.${avatarUser}`)
                    }
                )
            } catch (error) {
                console.error(error);
            }
        }
    
        //image
       
    
        
    }
}
    
    
    
    
 

    




    
    
