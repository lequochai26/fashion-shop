import OrderItem from "../../collections/OrderItem";
import Trigger from "../../types/Trigger";

const triggerForDeleteOrder:Trigger = async function (inserted,deleted) {
    const orderItems: any [] = await OrderItem.select({ orderId : deleted.orderId })

    for(const orderItem of orderItems){
        await OrderItem.delete(orderItem.orderId, orderItem.itemId)
    }
}
export default triggerForDeleteOrder