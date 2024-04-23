import CartItem from "../../collections/CartItem";
import ItemImage from "../../collections/ItemImage";
import Trigger from "../../types/Trigger";

const triggerForDeleteItem: Trigger = async function (inserted, deleted) {
    const cartItems: any[] = await CartItem.select({id: deleted.id});
    const itemImages: any[] = await ItemImage.select({path: deleted.path}); 

    for(const cartItem of cartItems) {
        await CartItem.delete(deleted.email, cartItem.itemId);
    }

    for(const itemImage of itemImages){ 
        await ItemImage.delete(deleted.path, itemImage.itemId); 
    }
}

export default triggerForDeleteItem;
