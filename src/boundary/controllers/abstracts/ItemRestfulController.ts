import DomainManager from "../../../domain/DomainManager";
import Item from "../../../domain/entities/Item";
import ReversableConverter from "../../../utils/interfaces/ReversableConverter";
import ItemInfo from "../../infos/item/ItemInfo";
import RestfulController from "./RestfulController";

export default abstract class ItemRestfulController extends RestfulController {
    // Fields:
    protected itemInfoConverter: ReversableConverter<Item, ItemInfo>;

    // Constructors:
    public constructor(
        itemInfoConverter: ReversableConverter<Item, ItemInfo>,
        domainManager?: DomainManager | undefined
    ) { 
        super(domainManager);

        this.itemInfoConverter = itemInfoConverter;
    }
}