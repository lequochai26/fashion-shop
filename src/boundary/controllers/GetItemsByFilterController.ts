import DomainManager from "../../domain/DomainManager";
import Item from "../../domain/entities/Item";
import ReversableConverter from "../../utils/interfaces/ReversableConverter";
import ItemInfo from "../infos/item/ItemInfo";
import QueryItemRestfulController from "./abstracts/QueryItemRestfulController"
import RestfulControllerParam from "./interfaces/RestfulControllerParam";

export default class GetItemsByFilterController extends QueryItemRestfulController {
    //Constructor
    public constructor (
        itemInfoConverter : ReversableConverter<Item,ItemInfo>,
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
        
        //Return result
        response.json(
            {
                success: true,
                result: items.map((item:Item):ItemInfo => {
                    return self.itemInfoConverter.convert(item)
                })
            }
        )
    }
}