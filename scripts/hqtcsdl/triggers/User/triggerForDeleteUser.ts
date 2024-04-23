import CartItem from "../../collections/CartItem";
import Trigger from "../../types/Trigger";

const triggerForDeleteUser: Trigger = async function (inserted, deleted) {
    const cartItems: any[] = await CartItem.select({email: deleted.email});

    for(const cartItem of cartItems) {
        await CartItem.delete(deleted.email, cartItem.itemId);
    }
}

export default triggerForDeleteUser;