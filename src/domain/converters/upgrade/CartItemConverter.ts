import CartItemData from "../../../persistence/data/CartItemData";
import AsyncReversableConverter from "../../../utils/interfaces/AsyncReversableConverter";
import CartItem from "../../entities/upgrade/CartItem";
import Item from "../../entities/upgrade/Item";
import User from "../../entities/upgrade/User";

export default class CartItemConverter implements AsyncReversableConverter<CartItemData, CartItem> {
    //Fields

    //Constructor
    public constructor(){

    }


    //methods
   public async convert(from: CartItemData): Promise<CartItem> {
        const cartItem = new CartItem;

        const user: User = new User(); //Có trong CartItem ở Converter DomainLayer
        const item: Item = new Item(); //Có trong CartItem ở Converter DomainLayer
        
        (user as any).fromConverter = true;
        (item as any).fromConverter = true;

        user.Email = from.email; //Khoá chính 
        item.Id = from.itemId; // Khoá chính

        cartItem.User = user;
        cartItem.Item = item;
        
        cartItem.Amount = from.amount;
        cartItem.Metadata = (from.metadata ? JSON.parse(from.metadata) : undefined);
        
        return cartItem;
    }
    public async reverse(from: CartItem): Promise<CartItemData> {
        return{
            email: (await from.getUser())?.Email as string,
            itemId: (await from.getItem())?.Id as string,
            amount: from.Amount as number,
            metadata: (from.Metadata ? JSON.stringify(from.Metadata) : undefined),

        }
    }



}