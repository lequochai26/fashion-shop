import Brand from "../../domain/entities/Brand";
import Item from "../../domain/entities/Item";
import ItemMetadata from "../../domain/entities/ItemMetadata";
import ItemType from "../../domain/entities/ItemType";
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
            metadata: from.Metadata?.toJSON(),
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
            from.metadata && new ItemMetadata(from.metadata)
        );

        // ItemType dependency
        if (from.type) {
            const type: ItemType = new ItemType();
            type.Id = from.type.id;
            item.Type = type;
        }

        // Brand dependency
        if (from.brand) {
            const brand: Brand = new Brand();
            brand.Id = from.brand.id;
            item.Brand = brand;
        }

        // Return item
        return item;
    }
}