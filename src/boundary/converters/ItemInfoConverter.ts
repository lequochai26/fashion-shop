import Item from "../../domain/entities/Item";
import ItemType from "../../domain/entities/ItemType";
import Converter from "../../utils/interfaces/Converter";
import ReversableConverter from "../../utils/interfaces/ReversableConverter";
import ItemInfo from "../infos/item/ItemInfo";

export default class ItemInfoConverter implements ReversableConverter<Item, ItemInfo> {
    // Constructor:
    public constructor() {

    }

    // Methods:
    public convert(from: Item): ItemInfo {
        return {
            id: from.Id as string,
            avatar: from.Avatar as string,
            name: from.Name as string,
            description: from.Description as string,
            price: from.Price as number,
            amount: from.Amount as number,
            gender: from.Gender as boolean,
            metadata: from.Metadata,
            type: (
                from.Type
                ? {
                    id: from.Type.Id as string,
                    name: from.Type.Name as string
                }
                : undefined
            ),
            brand: (
                from.Brand
                ? {
                    id: from.Brand.Id as string,
                    name: from.Brand.Name as string
                }
                : undefined
            ),
            images: from.Images.map(
                function (image) {
                    return image.Path as string;
                }
            ),
            orders: from.Orders.map(
                function (order) {
                    return order.Order?.Id as string;
                }
            )
        }
    }

    public reverse(from: ItemInfo): Item {
        // New Item
        const item: Item = new Item(
            from.id,
            from.avatar,
            from.name,
            from.description,
            from.price,
            from.amount,
            from.gender,
            from.metadata,
        );

        // TODO ...

        // Return item
        return item;
    }
}