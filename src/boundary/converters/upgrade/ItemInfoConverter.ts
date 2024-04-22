import Item from "../../../domain/entities/upgrade/Item";
import AsyncConverter from "../../../utils/interfaces/AsyncConverter";
import ItemInfo from "../../infos/item/ItemInfo";

export default class ItemInfoConverter implements AsyncConverter<Item, ItemInfo> {
    // Constructor:
    public constructor() {

    }

    // Methods:
    public async convert(from: Item): Promise<ItemInfo> {
        return {
            id: from.Id as string,
            avatar: from.Avatar as string,
            name: from.Name as string,
            description: from.Description as string,
            price: from.Price as number,
            buyPrice: from.BuyPrice as number,
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
}