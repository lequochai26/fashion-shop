import Trigger from "../../types/Trigger";
import CartItem from "../../collections/CartItem";
import ItemImage from "../../collections/ItemImage";


const triggerForDeleteItem: Trigger = async function (inserted, deleted) {
    const cartItems: any[] = await CartItem.select({itemId: deleted.id});
    const itemImages: any[] = await ItemImage.select({itemId: deleted.id}); 

    for(const cartItem of cartItems) {
        await CartItem.delete(cartItem.email, cartItem.itemId);
    }

    for(const itemImage of itemImages){ 
        await ItemImage.delete(itemImage.path,itemImage.itemId); 
    }
}

export default triggerForDeleteItem;
