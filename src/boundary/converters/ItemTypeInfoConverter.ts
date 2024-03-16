import ItemType from "../../domain/entities/ItemType";
import Converter from "../../utils/interfaces/Converter";
import ItemTypeInfo from "../infos/itemtype/ItemTypeInfo";

export default class ItemTypeInfoConverter implements Converter<ItemType, ItemTypeInfo> {
    // Constructors:
    public constructor() {

    }

    // Methods:
    public convert(from: ItemType): ItemTypeInfo {
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