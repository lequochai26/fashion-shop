import Item from "../../../../domain/entities/upgrade/Item";
import DomainManager from "../../../../domain/upgrade/DomainManager";
import AsyncConverter from "../../../../utils/interfaces/AsyncConverter";
import ItemInfo from "../../../infos/item/ItemInfo";
import RestfulController from "./RestfulController";

export default abstract class QueryItemRestfulController extends RestfulController {
    // Fields:
    protected itemInfoConverter: AsyncConverter<Item, ItemInfo>;

    // Constructors:
    public constructor(
        itemInfoConverter: AsyncConverter<Item, ItemInfo>,
        domainManager?: DomainManager | undefined
    ) { 
        super(domainManager);

        this.itemInfoConverter = itemInfoConverter;
    }
}