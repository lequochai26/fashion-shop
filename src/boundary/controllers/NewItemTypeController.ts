
import DomainManager from "../../domain/DomainManager";
import ItemType from "../../domain/entities/ItemType";
import RestfulController from "./abstracts/RestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";
import RestfulError from "../errors/RestfulError";
import PermissionRequiredRestfulController from "./PermissionRequiredRestfulController";

export default class NewItemTypeController extends PermissionRequiredRestfulController {

    //Constructor:
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);
    }

    //Methods
    //1. Execute = bước 1
    public async execute({ request, response }: RestfulControllerParam): Promise<void> {

        //Khởi tạo đường dẫn 
        const path: any[] = [];

        //Validate
        try {
            await this.managerValidateController.execute({ request, path});
        } catch (error: any) {
            if(error instanceof RestfulError) {
                response.json(
                    {
                        success: false,
                        message: error.message,
                        code: error.Code
                    }
                );

                return;
            } else {
                response.json(
                    {
                        success: false,
                        message: "Failed while handling with DB!",
                        code: "HANDLING_DB_FAILED"
                    }
                );

                return;
            }
        }
        
        //2. Khởi tạo id 
        const id: string | undefined = request.body.id;


        if (!id) { //2a. Không cung cấp id
            response.json({ //2b. hệ thống phản hồi về EA 
                success: false,
                message: "id parameter is required!",
                code: "ID_Required",
            });
            return;
        }

        //3. Cung cấp tên và kiểm tra
        const name: string | undefined = request.body.name;
        if (!name) {
            response.json(
                {
                    success: false,
                    message: "name parameter is required!",
                    code: "NAME_REQUIRED"
                });
            return;
        }

        //4. Hệ thống kiểm tra và xác nhận mã số được cung cấp bởi External App không thuộc bất cứ loại sản phẩm nào đã tồn tại.
        let itemType: ItemType | undefined;
        try {
            itemType = await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.getItemType(id, path);

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
                });

        }

        //Kiểm tra - bị trùng id 
        if (itemType) {
            response.json(
                {
                    success: false,
                    message: "Already exist an item type with given id!",
                    code: "ITEMTYPE_ALREADY_EXIST"
                });
            return;
        }


        // Hệ thống kiểm tra và xác nhận External App
        // có cung cấp TÊN cho loại sản phẩm.


        //. 5 Tạo mới ItemType
        itemType = new ItemType();
        itemType.Id = id;
        itemType.Name = name;


        //67ab Hệ thống yêu cầu cơ sở dữ liệu lưu loại sản phẩm.
        //Cơ sở dữ liệu lưu loại sản phẩm theo yêu cầu.
        try {
            await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.insertItemType(itemType as ItemType)
                }
            );
        } catch (error: any) {
            console.error(error)
            response.json(
                {
                    success: false,
                    message: "Failed while handling with DB!",
                    code: "HANDLING_DB_FAILED"
                }
            );
            return;
        }
        //8. Phản hồi thành công
        response.json(
            { success: true }
        );
    }


}