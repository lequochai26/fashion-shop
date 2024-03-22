import DomainManager from "../../domain/DomainManager";
import ItemType from "../../domain/entities/ItemType";
import RestfulController from "./abstracts/RestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";




export default class RemoveItemTypeController extends RestfulController{
  //constructor:
  public constructor(domainManager?: DomainManager |undefined){
    super(domainManager);
  }

  //method
  public async execute({ request, response }: RestfulControllerParam): Promise<void> {
      //id 
      const id: string | undefined = request.query.id as string | undefined;
        if(!id){
            response.json(
                {
                    success : false,
                    message : "id parameter is required!",
                    code : "ID_REQUIRED"
                }

            );
            return;
        }

        const path : any[] =[];
        let itemType : ItemType | undefined;
        try {
            itemType = await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.getItemType(id,path);
                }
            );
        } catch (error: any) {
            response.json(
                {
                    success:false,
                    message:"Failed while handling with DB!",
                    code:"HANDLING_DB_FAILED"
                }
            );
            return;
            
        }

        if(!itemType){
            response.json(
                {
                    success:false,
                    message:"ItemType is not exist!",
                    code: "ITEMTYPE_NOT_EXIST"
                }
            )
            return;
        }

        if(itemType.Items.length >0){
            response.json(
                {
                    success:false,
                    message :"Please make sure no items linked to this item type before performing this action!",
                    code:"ITEM_LINKED"
                }
            );
            return;
        }

        //delete
        try {
            await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.removeItemType(itemType as ItemType);
                }
            );
        } catch (error:any) {
            console.error(error);

            response.json(
                {
                success:false,
                message: "Failed while handling with DB!",
                code : "HANDLING_DB_FAILED"
                }
            );
            return;
            
        }

     //response to client
       response.json({success: true});

     }
}