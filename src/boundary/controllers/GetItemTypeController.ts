import DomainManager from "../../domain/DomainManager";
import ItemType from "../../domain/entities/ItemType";
import Converter from "../../utils/interfaces/Converter";
import ItemTypeInfo from "../infos/itemtype/ItemTypeInfo";
import QueryItemTypeRestfulController from "./abstracts/QueryItemTypeRestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";

export default class GetItemTypeController extends QueryItemTypeRestfulController{
    //Constructor
    public constructor(
        itemTypeInfoConverter: Converter<ItemType, ItemTypeInfo>,
        domainManager?: DomainManager | undefined
    ) {
        super(itemTypeInfoConverter, domainManager);
    }
    
    //method:
    public async execute({ request ,response }: RestfulControllerParam): Promise<void> {
        //Get id from query
        const id: string | undefined = request.query.id as string;

        //id not found case
        if(!id) {
            response.json(
                {
                    success: false,
                    message: "id parameter is required!",
                    code: "ID_REQUIRED"
                }
            );
        }

        //Path initialazation
        const path: any[] = [];

        //Get itemType 
        try {
            var itemType: ItemType | undefined =  await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.getItemType(id, path);
                }
            );
        } catch (error) {
            console.log(error);

            response.json(
                {
                    success: false,
                    message: "Failed while handling with DB!",
                    code: "HANDLING_DB_FAILED"
                }
            );

            return;
        }

        //return
        response.json(
            {
                success: true,
                result: itemType && this.itemTypeInfoConverter.convert(itemType)
            }
        )
    }
}