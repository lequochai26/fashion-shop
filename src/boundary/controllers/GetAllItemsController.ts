import DomainManager from "../../domain/DomainManager";
import Item from "../../domain/entities/Item";
import RestfulController from "./abstracts/RestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";

export default class GetAllItemsController extends RestfulController {
    // Constructors:
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);
    }

    // Methods:
    public async execute({ response }: RestfulControllerParam): Promise<void> {
        // Path initization
        const path: any[] = [];

        // Get all items
        const items: Item[] = await this.useDomainManager(
            async function (domainManager) {
                return domainManager.getAllItems(path);
            }
        )

        // Responding to client
        response.json(
            {
                success: true,
                result: items.map(
                    function (item: Item) {
                        return {
                            id: item.Id,
                            name: item.Name
                        }
                    }
                )
            }
        );
    }
}