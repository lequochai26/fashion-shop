import DomainManager from "../../domain/DomainManager";
import Item from "../../domain/entities/Item";
import ReversableConverter from "../../utils/interfaces/ReversableConverter";
import ItemInfo from "../infos/item/ItemInfo";
import QueryItemRestfulController from "./abstracts/QueryItemRestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";

export default class GetAllItemsController extends QueryItemRestfulController {
    // Constructors:
    public constructor(
        itemInfoConverter: ReversableConverter<Item, ItemInfo>,
        domainManager?: DomainManager | undefined
    ) {
        super(itemInfoConverter, domainManager);
    }

    // Methods:
    public async execute({ response }: RestfulControllerParam): Promise<void> {
        // Self definition
        const self: GetAllItemsController = this;

        // Path initization
        const path: any[] = [];

        // Get all items
        try {
            var items: Item[] = await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.getAllItems(path);
                }
            )
        }
        catch (error: any) {
            console.error(error);

            response.json(
                {
                    success: false,
                    message: "Failed while handling with DB!"
                }
            );

            return;
        }

        // Responding to client
        response.json(
            {
                success: true,
                result: items.map(
                    function (item: Item): ItemInfo {
                        return self.itemInfoConverter.convert(item);
                    }
                )
            }
        );
    }
}