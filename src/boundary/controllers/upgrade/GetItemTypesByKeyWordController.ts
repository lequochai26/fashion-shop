import ItemType from "../../../domain/entities/upgrade/ItemType";
import DomainManager from "../../../domain/upgrade/DomainManager";
import AsyncConverter from "../../../utils/interfaces/AsyncConverter";
import ItemTypeInfo from "../../infos/itemtype/ItemTypeInfo";
import QueryItemTypeRestfulController from "../abstracts/upgrade/QueryItemTypeRestfulController";
import RestfulControllerParam from "../interfaces/RestfulControllerParam";

export default class GetItemTypeByKeywordController extends QueryItemTypeRestfulController {
    //Constructor
    public constructor(
        itemTypeInfoConverter: AsyncConverter<ItemType, ItemTypeInfo>,
        domainManager?: DomainManager | undefined
    ) {
        super(itemTypeInfoConverter, domainManager);
    }


    //Methods

    //External App gửi yêu cầu truy vấn danh sách sản phẩm theo từ khóa đến hệ thống.
    public async execute({ request, response }: RestfulControllerParam): Promise<void> {
        //Hệ thống kiểm tra và xác nhận External App có cung cấp từ khóa truy vấn.
        const keyword: string | undefined = request.query.keyword as string;

        if (!keyword) { // Hệ thống kiểm tra và nhận thấy External App không cung cấp từ khóa truy vấn.
            response.json(
                {
                    /*Hệ thống phản hồi về External App với trạng thái thất bại kèm theo dòng thông điệp:
                     "keyword parameter is required!" và mã phản hồi: "KEYWORD_REQUIRED". */
                    success: false,
                    message: "keyword is required!",
                    code: "KEYWORD_REQUIRED"
                }
            );
            return;
        }

        //Self definition
        const self: GetItemTypeByKeywordController = this;

        /**/
        try {
            var itemTypes: ItemType[] = await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.searchItemTypes(keyword);
                }
            )
        } catch (error: any) {
            console.error(error);

            response.json(
                {
                    success: false,
                    message: "Failed while handling with DB",
                    code: "HANDLING_DB_FAILED"
                }
            );
            return;
        }

        const result: ItemTypeInfo[] = [];
        for (const itemType of itemTypes) {
            result.push(await this.itemTypeInfoConverter.convert(itemType));
        }

        /*Hệ thống phản hồi về External App với trạng thái thành công kèm theo danh sách loại sản phẩm sau khi lọc.*/
        response.json(
            {
                success: true,
                result
            }
        );
    }
}