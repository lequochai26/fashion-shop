import Item from "../../domain/entities/Item";
import Converter from "../../utils/interfaces/Converter";
import ItemInfo from "../infos/item/ItemInfo";

export default class ItemInfoConverter implements Converter<Item, ItemInfo> {
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
            metadata: (from.MetaData ? JSON.parse(from.MetaData) : undefined),
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
}