import DomainManager from "../../domain/DomainManager";
import User from "../../domain/entities/User";
import Session from "../../utils/Session";
import Path from "../../domain/enums/Path";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";
import Controller from "./interfaces/Controller";
import UpdatePersonalInfoController from "./UpdatePersonalInfoController";
import PermissionRequiredRestfulController from "./abstracts/PermissionRequiredRestfulController";
import RestfulError from "../errors/RestfulError";

export default class UpdateUserController extends PermissionRequiredRestfulController {

    //construstor
    public constructor(domainManager?: DomainManager | undefined) {
        super(domainManager);
    }

    //method
    public async execute({ request, response }: RestfulControllerParam): Promise<void> {
        // Pre-condition check
        const dispatchedFrom: Controller<RestfulControllerParam, void> = (request as any).dispatchedFrom;

        let target: User | undefined = undefined;

        const path: any[] = response.locals.path || [];

        if (dispatchedFrom instanceof UpdatePersonalInfoController) {
            target = response.locals.user;
        }
        else {
            try {
                await this.managerValidateController.execute({ request, path });
            }
            catch (error: any) {
                if (error instanceof RestfulError) {
                    response.json({
                        success: false,
                        message: error.message,
                        code: error.Code
                    });
                }
                else {
                    console.error(error);
                    response.json({
                        success: false,
                        message: "Failed while handling with DB!",
                        code: "HANDLING_DB_FAILED"
                    });
                }
                return;
            }
        }

        // Check user
        if (!target) {
            const email: string | undefined = request.body.email;

            if (!email) {
                response.json({
                    success: false,
                    message: "email parameter is required!",
                    code: "EMAIL_REQUIRED"
                });
                return;
            }

            try {
                target = await this.useDomainManager(
                    async function (domainManager) {
                        return domainManager.getUser(email,path);
                    }
                );
            }
            catch (error: any) {
                response.json({
                    success: false,
                    message: "Failed while handling with DB!",
                    code: "HANDLING_DB_FAILED"
                });
                return;
            }

            if (!target) {
                response.json(
                    {
                        success: false,
                        message: "User not exist!",
                        code: "USER_NOT_EXIST"
                    }
                );
                return;
            }
        }

        //check name
        const fullName: string | undefined = request.body.fullName;

        if (fullName) {
           
            target.FullName = fullName;
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
            target.PhoneNumber = phoneNumber;
        }

        


        //gender

        const genderUser: string | undefined = request.body.gender;


        if (genderUser) {
            const gender: boolean = genderUser === 'true';

            target.Gender = gender;
        }


        //check address
        const address: string | undefined = request.body.address;

        if (address) {
           
            target.Adress = address;
        }


        //check permission
        let permission: string|undefined = request.body.permission;

        if(permission){

            target.Permission = permission;
        }



        //check avatar
        let avatarUser: string = target.Avatar as string;

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

                    target.Avatar = avatarPath;
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
                    return domainManager.updateUser(target as User);
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













