import Item from "../../../domain/entities/upgrade/Item";
import DomainManager from "../../../domain/upgrade/DomainManager";
import AsyncConverter from "../../../utils/interfaces/AsyncConverter";
import ItemInfo from "../../infos/item/ItemInfo";
import QueryItemRestfulController from "../abstracts/upgrade/QueryItemRestfulController";
import RestfulControllerParam from "../interfaces/RestfulControllerParam";

export default class GetAllItemsController extends QueryItemRestfulController {
    // Constructors:
    public constructor(
        itemInfoConverter: AsyncConverter<Item, ItemInfo>,
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

        const result: ItemInfo[] = [];
        for (const item of items) {
            result.push(await this.itemInfoConverter.convert(item));
        }

        // Responding to client
        response.json(
            {
                success: true,
                result
            }
        );
    }
}