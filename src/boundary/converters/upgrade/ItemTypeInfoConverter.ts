import ItemType from "../../../domain/entities/upgrade/ItemType";
import AsyncConverter from "../../../utils/interfaces/AsyncConverter";
import ItemTypeInfo from "../../infos/itemtype/ItemTypeInfo";

export default class ItemTypeInfoConverter implements AsyncConverter<ItemType, ItemTypeInfo> {
    // Constructors:
    public constructor() {

    }

    // Methods:
    public async convert(from: ItemType): Promise<ItemTypeInfo> {
        return {
            id: from.Id as string,
            name: from.Name as string,
            items: from.Items.map(
                function (item) {
                    return item.Id as string;
                }
            )
        };
    }
}