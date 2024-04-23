import ItemType from "../../../domain/entities/upgrade/ItemType";
import DomainManager from "../../../domain/upgrade/DomainManager";
import AsyncConverter from "../../../utils/interfaces/AsyncConverter";
import ItemTypeInfo from "../../infos/itemtype/ItemTypeInfo";
import QueryItemTypeRestfulController from "../abstracts/upgrade/QueryItemTypeRestfulController";
import RestfulControllerParam from "../interfaces/RestfulControllerParam";

export default class GetAllItemTypesController extends QueryItemTypeRestfulController {
    //Constructor
    public constructor(
        itemTypeInfoConverter: AsyncConverter<ItemType,ItemTypeInfo>,
        domainManager?: DomainManager | undefined
    ) {
        super(itemTypeInfoConverter, domainManager);
    }

    public async execute( { response }: RestfulControllerParam): Promise<void> {
        //Self definition
        const self: GetAllItemTypesController = this;

        //Path initialazation
        const path: any[] = [];

        //Get all item type
        try {
            var itemTypes: ItemType[] = await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.getAllItemTypes(path);
                }
            );
        } catch (error: any) {
            console.error(error);

            response.json(
                {
                    success: false,
                    message:"Failed while handling with DB!",
                    code:"HANDLING_DB_FAILED"
                }
            );

            return;
        }

        const result: ItemTypeInfo[] = [];
        for (const itemType of itemTypes) {
            result.push(await this.itemTypeInfoConverter.convert(itemType));
        }

        //Responding to client
        response.json(
            {
                success: true,
                result
            }
        );
    }
}