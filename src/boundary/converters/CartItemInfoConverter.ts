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
            amount: from.Amount as number,
            avatar: from.Item?.Avatar as string,
            id: from.Item?.Id as string,
            metadata: from.Metadata,
            name: from.Item?.Name as string,
            price: from.Item?.Price as number
        };
    }
}