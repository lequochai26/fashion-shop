import DomainManager from "../../../domain/DomainManager";
import Item from "../../../domain/entities/Item";
import Converter from "../../../utils/interfaces/Converter";
import ItemInfo from "../../infos/item/ItemInfo";
import RestfulController from "./RestfulController";

export default abstract class ItemRestfulController extends RestfulController {
    // Fields:
    protected itemInfoConverter: Converter<Item, ItemInfo>;

    // Constructors:
    public constructor(
        itemInfoConverter: Converter<Item, ItemInfo>,
        domainManager?: DomainManager | undefined
    ) { 
        super(domainManager);

        this.itemInfoConverter = itemInfoConverter;
    }
}