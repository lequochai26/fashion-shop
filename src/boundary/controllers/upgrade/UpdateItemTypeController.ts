import ItemType from "../../../domain/entities/upgrade/ItemType";
import DomainManager from "../../../domain/upgrade/DomainManager";
import RestfulError from "../../errors/RestfulError";
import PermissionRequiredRestfulController from "../abstracts/upgrade/PermissionRequiredRestfulController";
import RestfulControllerParam from "../interfaces/RestfulControllerParam";

export default class UpdateItemTypeController extends PermissionRequiredRestfulController {
    //Constructor
    public constructor(domainManager?: DomainManager | undefined){
        super(domainManager);
    }
    
    //Methods
    public async execute({request, response}: RestfulControllerParam): Promise<void> {
        const path: any[] = [];
        
        //validate
        try{
            await this.managerValidateController.execute({request,path});     
        }catch(error: any){
            if(error instanceof RestfulError){
                response.json({
                    success: false,
                    message: error.message,
                    code: error.Code
                });
                return;
            }else{
                response.json({
                    success: false,
                    message: "Failed while handling with DB!",
                    code: "HANDLING_DB_FAILED"
                });
                return;
            }
        }
        
        
        const id: string | undefined = request.body.id;

        //id
        if(!id){
            response.json({
                success: false,
                message: "id parameter is required!",
                code: "ID_REQUIRED"
            });
            return;
        }


        let itemType: ItemType | undefined;
        try{
            itemType = await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.getItemType(id, path);
                }
            )
        }
        catch(error:any){
            console.error(error);

            response.json({
                success: false,
                message: "Failed while handling with DB!",
                code: "HANDLING_DB_FAILED"
            });
            return;
        }

        if(!itemType){
            response.json({
                success: false,
                message: "Item type not exist!",
                code: "ITEMTYPE_NOT_EXIST"
            });
            return;
        }

        //name
        const name: string | undefined = request.body.name as string;

        if(name){
            itemType.Name=name;
        }


        //Update data in db
        try{
            await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.updateItemType(itemType as ItemType);
                }
            )
        }catch(error: any){
            console.error(error);

            response.json({
                success: false,
                message: "Failed while handling with DB!",
                code: "HANDLING_DB_FAILED"
            })
            return;
        }

        response.json({
            success: true
        })
    }
}