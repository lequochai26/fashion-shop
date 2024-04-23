import ItemType from "../../../../domain/entities/upgrade/ItemType";
import DomainManager from "../../../../domain/upgrade/DomainManager";
import AsyncConverter from "../../../../utils/interfaces/AsyncConverter";
import ItemTypeInfo from "../../../infos/itemtype/ItemTypeInfo";
import RestfulController from "./RestfulController";

export default abstract class QueryItemTypeRestfulController extends RestfulController {
    // Fields:
    protected itemTypeInfoConverter: AsyncConverter<ItemType, ItemTypeInfo>;

    // Constructors:
    public constructor(
        itemTypeInfoConverter: AsyncConverter<ItemType, ItemTypeInfo>,
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);

        this.itemTypeInfoConverter = itemTypeInfoConverter;
    }
}