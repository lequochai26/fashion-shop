import Trigger from "../../types/Trigger";
import CartItem from "../../collections/CartItem";
import ItemImage from "../../collections/ItemImage";


const triggerForDeleteItem: Trigger = async function (inserted, deleted) {
    const cartItems: any[] = await CartItem.select({id: deleted.id});
    const itemImages: any[] = await ItemImage.select({path: deleted.path}); 

    for(const cartItem of cartItems) {
        await CartItem.delete(cartItem.email, deleted.itemId);
    }

    for(const itemImage of itemImages){ 
        await ItemImage.delete(itemImage.path,deleted.itemId); 
    }
}

export default triggerForDeleteItem;