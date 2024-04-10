import DomainManager from "../../domain/DomainManager";
import User from "../../domain/entities/User";
import UserPermission from "../../domain/enums/UserPermission";
import Session from "../../utils/Session";
import Path from "../../domain/enums/Path";
import RestfulController from "./abstracts/RestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";

export default class UpdateUserController extends RestfulController {

    //construstor
    public constructor(domainManager?: DomainManager | undefined) {
        super(domainManager);
    }

    //method
    public async execute({ request, response }: RestfulControllerParam): Promise<void> {
        //nhung session vao request

        const session: Session = (request as any).session;

        let email: string | undefined = request.body.email as string;

        if (!email) {
            email = session.get("user");
            if (!email) {
                response.json(
                    {
                        success: false,
                        message: "email parameter is required!",
                        code: "EMAIL_REQUIRED"
                    }
                );
                return;
            }
        }

        //path
        const path: any[] = [];

        //check user
        let user: User | undefined;
        try {
            user = await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.getUser(email as string, path);
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

        if (!user) {
            response.json(
                {
                    success: false,
                    message: "User not exist!",
                    code: "USER_NOT_EXIST"
                }
            );

            return;
        }

        //check name
        const fullName: string | undefined = request.body.fullName;

        if (fullName) {
           
            user.FullName = fullName;
        }

        
        //phone

        const phoneNumber: string | undefined = request.body.phoneNumber;

        if (phoneNumber) {
           
          
           const phoneCheck: RegExp = /^(0|\+84)(\d{9,10})$/;
   
           if (!phoneCheck.test(phoneNumber)) {
            response.json(
                {
                    success: false,
                    message: "phonenumber invalid",
                    code: "PHONENUMBER_INVALID"
                }
            );
            return;
        }
            user.PhoneNumber = phoneNumber;
        }

        


        //gender

        const genderUser: string | undefined = request.body.gender;


        if (genderUser) {
            const gender: boolean = genderUser === 'true';

            user.Gender = gender;
        }


        //check address
        const address: string | undefined = request.body.address;

        if (address) {
           
            user.Adress = address;
        }


        //check permission
        let permission: string|undefined = request.body.permission;

        if(permission){

            user.Permission = permission;
        }



        //check avatar
        let avatarUser: string = user.Avatar as string;

        let avatarFileName: string;

        let avatarUpdate: boolean = false;

        let avatarPath : string;

        const [avatar]: Express.Multer.File[] = this.getFiles(request, "avatar");

        if (avatar) {
            //check avatar is an image
            if (await this.useDomainManager(async function (domainManager) {
                return domainManager.isImageFile(avatar);
            })) {
                try {
                    avatarFileName = await this.useDomainManager(
                        async function (domainManager) {
                            return domainManager.writeFileAutoName(`${Path.USER_AVATAR_LOCAL_PATH}/`, avatar);
                        }
                    )

                    avatarPath = `${Path.USER_AVATAR_HTTP_PATH}/${avatarFileName}`

                    user.Avatar = avatarPath;
                    avatarUpdate = true;
                } catch (error) {
                    console.error(error);
                }
            }



        }

     
        
        //update
        try {
            await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.updateUser(user as User);
                }
            )
        } catch (error) {
            console.error(error);

            if (avatarUpdate) {
                try {
                    //delete
                    await this.useDomainManager(
                        async function (domainManager) {
                            return domainManager.deleteFile(`${Path.USER_AVATAR_HTTP_PATH}/${avatarFileName}`)
                        }
                    );
                } catch (error) {
                    console.error(error);
                }
            }
            response.json(
                {
                    success: false,
                    message: "Failed while handling with DB!",
                    code: "HANDLING_DB_FAILED"
                }
            );

            return;
        }

        if (avatarUpdate) {
            if (avatarUser !== Path.DEFAULT_USER_AVATAR_HTTP_PATH) {
                let avatarUserName: string = await this.useDomainManager(
                    async function (domainManager) {
                        return domainManager.getFileNameFromPath(avatarUser);
                    }
                );
                try {
                    await this.useDomainManager(
                        async function (domainManager) {
                            return domainManager.deleteFile(`${Path.USER_AVATAR_HTTP_PATH}/${avatarUserName}`)
                        }
                    )
                } catch (error) {
                    console.error(error);
                }
            }
        }

        
        response.json(
            {
                success: true
            }
        )



    }
}













