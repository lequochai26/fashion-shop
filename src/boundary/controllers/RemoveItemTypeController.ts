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
  //External App gửi yêu cầu xóa loại sản phẩm đến hệ thống.
  public async execute({ request, response }: RestfulControllerParam): Promise<void> {
      //id 
      //Hệ thống kiểm tra và xác nhận External App đã cung cấp mã loại sản phẩm cần được xóa khỏi cơ sở dữ liệu hệ thống.
      const id: string | undefined = request.query.id as string | undefined;
      //Hệ thống kiểm tra và nhận thấy External App chưa cung cấp mã loại sản phẩm cần được xóa khỏi cơ sở dữ liệu hệ thống. 
      if(!id){
        //Hệ thống phản hồi về External App với trạng thái thất bại  và mã phản hồi
            response.json(
                {
                    success : false,
                    message : "id parameter is required!",
                    code : "ID_REQUIRED"
                }

            );
            return;
        }
        //Hệ thống kiểm tra và xác nhận mã loại sản phẩm được cung cấp bởi External App thuộc về một loại sản phẩm đã tồn tại trong cơ sở dữ liệu hệ thống.
        const path : any[] =[];
        let itemType : ItemType | undefined;
        try {
        //Hệ thống kiểm tra và nhận thấy mã loại sản phẩm được cung cấp bởi External App không thuộc bất cứ loại sản phẩm nào đã tồn tại trong cơ sở dữ liệu hệ thống. 
            itemType = await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.getItemType(id,path);
                }
            );
        } catch (error: any) {
        //Hệ thống phản hồi về External App với trạng thái thất bại kèm theo dòng thông điệp và mã phản hồi
            response.json(
                {
                    success:false,
                    message:"Failed while handling with DB!",
                    code:"HANDLING_DB_FAILED"
                }
            );
            return;
            
        }
        //Hệ thống kiểm tra và xác nhận không có sản phẩm nào được liên kết với loại sản phẩm này.
        if(!itemType){
        //Hệ thống phản hồi về External App với trạng thái thất bại kèm theo dòng thông điệp và mã phản hồi
            response.json(
                {
                    success:false,
                    message:"ItemType is not exist!",
                    code: "ITEMTYPE_NOT_EXIST"
                }
            )
            return;
        }
        //Hệ thống kiểm tra và xác nhận không có sản phẩm nào được liên kết với loại sản phẩm này.
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