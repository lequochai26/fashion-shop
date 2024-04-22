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
            item: (from.Item && 
                {
                    avatar: from.Item.Avatar as string,
                    id: from.Item.Id as string,
                    name: from.Item.Name as string,
                    price: from.Item.Price as number
                }
            ),
            amount: from.Amount as number,
            metadata: from.Metadata
        };
    }
}