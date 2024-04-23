import Order from "../../collections/Order";
import Trigger from "../../types/Trigger";

const triggerInteadOfDeleteUser: Trigger = async function(inserted, deleted): Promise<void>  {
    const users: any[] = await Order.select(
        {
            $or: [
                {createdBy : deleted.email},
                {orderedBy : deleted.email}
            ]
        }
    );

    if(users.length > 0 ){
        throw new Error("Không thể xoá người dùng có liên quan đến các đơn hàng có trong CSDL!");
    }
}

export default triggerInteadOfDeleteUser;