import CartItem from "../../../domain/entities/upgrade/CartItem";
import AsyncConverter from "../../../utils/interfaces/AsyncConverter";
import CartItemInfo from "../../infos/cartitem/CartItemInfo";

export default class CartItemInfoConverter implements AsyncConverter<CartItem, CartItemInfo> {
    // Constructors:
    public constructor() {

    }

    // Methods:
    public async convert(from: CartItem): Promise<CartItemInfo> {
        return {
            item: (await from.getItem() && 
                {
                    avatar: (await from.getItem())?.Avatar as string,
                    id: (await from.getItem())?.Id as string,
                    name: (await from.getItem())?.Name as string,
                    price: (await from.getItem())?.Price as number,
                    metadata: (await from.getItem())?.Metadata
                }
            ),
            amount: from.Amount as number,
            metadata: from.Metadata
        };
    }
}