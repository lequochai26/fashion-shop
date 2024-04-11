import CartItem from "../../domain/entities/CartItem";
import Converter from "../../utils/interfaces/Converter";
import CartItemInfo from "../infos/cartitem/CartItemInfo";

export default class CartItemInfoConverter implements Converter<CartItem, CartItemInfo> {
    // Constructors:
    public constructor() {

    }

    // Methods:
    public convert(from: CartItem): CartItemInfo {
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