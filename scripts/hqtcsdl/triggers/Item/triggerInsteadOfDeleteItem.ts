import Order from "../../collections/Order";
import Trigger from "../../types/Trigger";

const triggerInsteadOfDeleteItem: Trigger = async function(inserted, deleted): Promise<void>  {
    const items: any[] = await Order.select(
        {
            $or: [
                {createdBy : deleted.id},
                {orderedBy : deleted.id}
            ]
        }
    );

    if(items.length > 0 ){
        throw new Error("Không thể xoá người dùng có liên quan đến các đơn hàng có trong CSDL!");
    }
}

export default triggerInsteadOfDeleteItem;