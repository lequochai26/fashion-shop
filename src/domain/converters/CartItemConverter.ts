import CartItemData from "../../persistence/data/CartItemData";
import ReversableConverter from "../../utils/interfaces/ReversableConverter";
import CartItem from "../entities/CartItem";
import Item from "../entities/Item";
import User from "../entities/User";

export default class CartItemConverter implements ReversableConverter<CartItemData, CartItem> {
    //Fields

    //Constructor
    public constructor(){

    }


    //methods
   public convert(from: CartItemData): CartItem {
        const cartItem = new CartItem;

        const user: User = new User(); //Có trong CartItem ở Converter DomainLayer
        const item: Item = new Item(); //Có trong CartItem ở Converter DomainLayer
        
        user.Email = from.email; //Khoá chính 
        item.Id = from.itemId; // Khoá chính

        cartItem.User = user;
        cartItem.Item = item;
        
        cartItem.Amount = from.amount;
        cartItem.Metadata = (from.metadata ? JSON.parse(from.metadata) : undefined);



        return cartItem;
    }
   public  reverse(from: CartItem): CartItemData {
        return{
            email: from.User?.Email as string,
            itemId: from.Item?.Id as string,
            amount: from.Amount as number,
            metadata: (from.Metadata ? JSON.stringify(from.Metadata) : undefined),

        }
    }



}