import Item from "../../../domain/entities/upgrade/Item";
import AsyncConverter from "../../../utils/interfaces/AsyncConverter";
import ItemInfo from "../../infos/item/ItemInfo";

export default class ItemInfoConverter implements AsyncConverter<Item, ItemInfo> {
    // Constructor:
    public constructor() {

    }

    // Methods:
    public async convert(from: Item): Promise<ItemInfo> {
        const orders: string[] = [];
        for (const order of await from.getOrders()) {
            orders.push((await order.getOrder())?.Id as string);
        }

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
                (await from.getType())
                ? {
                    id: (await from.getType())?.Id as string,
                    name: (await from.getType())?.Name as string
                }
                : undefined
            ),
            brand: (
                (await from.getBrand())
                ? {
                    id: (await from.getBrand())?.Id as string,
                    name: (await from.getBrand())?.Name as string
                }
                : undefined
            ),
            images: (await from.getImages()).map(
                function (image) {
                    return image.Path as string;
                }
            ),
            orders
        }
    }
}