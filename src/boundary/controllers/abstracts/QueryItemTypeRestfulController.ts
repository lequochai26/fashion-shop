import DomainManager from "../../../domain/DomainManager";
import ItemType from "../../../domain/entities/ItemType";
import Converter from "../../../utils/interfaces/Converter";
import ItemTypeInfo from "../../infos/itemtype/ItemTypeInfo";
import RestfulController from "./RestfulController";

export default abstract class QueryItemTypeRestfulController extends RestfulController {
    // Fields:
    protected itemTypeInfoConverter: Converter<ItemType, ItemTypeInfo>;

    // Constructors:
    public constructor(
        itemTypeInfoConverter: Converter<ItemType, ItemTypeInfo>,
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);

        this.itemTypeInfoConverter = itemTypeInfoConverter;
    }
}