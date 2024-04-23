import Item from "../../../domain/entities/upgrade/Item";
import DomainManager from "../../../domain/upgrade/DomainManager";
import AsyncConverter from "../../../utils/interfaces/AsyncConverter";
import ItemInfo from "../../infos/item/ItemInfo";
import QueryItemRestfulController from "../abstracts/upgrade/QueryItemRestfulController";
import RestfulControllerParam from "../interfaces/RestfulControllerParam";

export default class GetItemsByKeywordController extends QueryItemRestfulController {
    //Constructor:
    public constructor(
        itemInfoConverter: AsyncConverter<Item,ItemInfo>,
        domainManager?: DomainManager | undefined

    ) {
        super(itemInfoConverter,domainManager);
    }

    //Methods
    public async execute({ request, response}: RestfulControllerParam): Promise<void> {
        //Get keyword 
        const keyword: string | undefined = request.query.keyword as string;

        if(!keyword) {
            response.json (
                {
                    success: false,
                    message: "keyword is required!",
                    code: "KEYWORD_REQUIRED"
                }
            );
            return;
        }

        //Self definition
        const self : GetItemsByKeywordController = this;

        //Get items by keyword
        try {
            var items: Item[] = await this.useDomainManager(
                async function(domainManager) {
                    return domainManager.searchItems(keyword);
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

        const result: ItemInfo[] = [];
        for (const item of items) {
            result.push(await this.itemInfoConverter.convert(item));
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