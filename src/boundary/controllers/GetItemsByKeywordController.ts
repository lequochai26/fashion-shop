import DomainManager from "../../domain/DomainManager";
import Item from "../../domain/entities/Item";
import ReversableConverter from "../../utils/interfaces/ReversableConverter";
import ItemInfo from "../infos/item/ItemInfo";
import QueryItemRestfulController from "./abstracts/QueryItemRestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";

export default class GetItemsByKeywordController extends QueryItemRestfulController {
    //Constructor:
    public constructor(
        itemInfoConverter: ReversableConverter<Item,ItemInfo>,
        domainManager?: DomainManager | undefined

    ) {
        super(itemInfoConverter,domainManager);
    }

    //Methods
    public async execute({ request, response}: RestfulControllerParam): Promise<void> {
        //Get keyword 
        const keyword: string | undefined = request.query.keyword as string | undefined;

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

        //Responding to client
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