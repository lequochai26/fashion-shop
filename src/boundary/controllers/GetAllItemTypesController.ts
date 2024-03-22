import DomainManager from "../../domain/DomainManager";
import ItemType from "../../domain/entities/ItemType";
import Converter from "../../utils/interfaces/Converter";
import ItemTypeInfo from "../infos/itemtype/ItemTypeInfo";
import QueryItemTypeRestfulController from "./abstracts/QueryItemTypeRestfulController"
import RestfulControllerParam from "./interfaces/RestfulControllerParam";

export default class GetAllItemTypesController extends QueryItemTypeRestfulController {
    //Constructor
    public constructor(
        itemTypeInfoConverter: Converter<ItemType,ItemTypeInfo>,
        domainManager : DomainManager | undefined
    ) {
        super(itemTypeInfoConverter,domainManager);
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
                    message:"Failed while handling with DB!"
                }
            );

            return;
        }

        //Responding to client
        response.json(
            {
                success: true,
                result: itemTypes.map(
                    function (itemType: ItemType): ItemTypeInfo {
                        return self.itemTypeInfoConverter.convert(itemType);
                    }
                )
            }
        );
    }
}