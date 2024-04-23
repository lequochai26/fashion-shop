import Item from "../../../domain/entities/upgrade/Item";
import DomainManager from "../../../domain/upgrade/DomainManager";
import AsyncConverter from "../../../utils/interfaces/AsyncConverter";
import ItemInfo from "../../infos/item/ItemInfo";
import QueryItemRestfulController from "../abstracts/upgrade/QueryItemRestfulController";
import RestfulControllerParam from "../interfaces/RestfulControllerParam";

export default class GetItemsByFilterController extends QueryItemRestfulController {
    //Constructor
    public constructor (
        itemInfoConverter : AsyncConverter<Item,ItemInfo>,
        domainManager?: DomainManager | undefined
    ) {
        super(itemInfoConverter,domainManager);
    }

    //Methods:
    public async execute({ request, response }: RestfulControllerParam): Promise<void> {
        //Get filter from request
        const filter: string | undefined = request.body.filter as string;
        let allRequired: boolean  = request.body.allRequired;

        if(!filter) {
            response.json(
                {
                    success: false,
                    message: "filter is required!",
                    code:"FILTER_REQUIRED"
                }
            );
            return;
        }

        //seft difinition
        const self : GetItemsByFilterController = this;
        
        //Check typeof filter
        if(typeof filter !== 'object'){
            response.json(
                {
                    success: false,
                    message: "type filter invalid",
                    code: "TYPE_INVALID"
                }
            )
        }

        if(allRequired === undefined) {
            allRequired = false;
        }

        //Get items by keyword
        try {
            var items: Item[] = await this.useDomainManager(
                async function(domainManager) {
                    return domainManager.getItemsByFilterFunc(Item.createFilterFunc(filter,allRequired));
                }
            );
        } catch (error: any) {
            console.error(error);

            response.json(
                {
                    success: false,
                    message: "Failed while handing with DB",
                    code: "HANDLING_DB_FAILED"
                }
            )
            return;
        }

        const result: ItemInfo[] = [];
        for (const item of items) {
            result.push(await this.itemInfoConverter.convert(item));
        }
        
        //Return result
        response.json(
            {
                success: true,
                result
            }
        )
    }
}