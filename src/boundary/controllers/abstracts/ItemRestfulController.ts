import DomainManager from "../../../domain/DomainManager";
import Item from "../../../domain/entities/Item";
import Converter from "../../../utils/interfaces/Converter";
import ItemInfo from "../../infos/item/ItemInfo";
import RestfulController from "./RestfulController";

export default abstract class ItemRestfulController extends RestfulController {
    // Fields:
    private itemInfoConverter?: Converter<Item, ItemInfo> | undefined;

    // Constructors:
    public constructor(
        domainManager?: DomainManager | undefined,
        itemInfoConverter?: Converter<Item, ItemInfo> | undefined
    ) { 
        super(domainManager);

        this.itemInfoConverter = itemInfoConverter;
    }

    // Methods:
    protected useItemInfoConverter<T>(
        executable: (itemInfoConverter: Converter<Item, ItemInfo>) => T
    ): T {
        if (!this.itemInfoConverter) {
            throw new Error("itemInfoConverter field is missing!");
        }

        return executable(this.itemInfoConverter);
    }
}