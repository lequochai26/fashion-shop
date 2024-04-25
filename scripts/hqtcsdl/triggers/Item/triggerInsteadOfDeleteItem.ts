import Trigger from "../../types/Trigger";
import Order from "../../collections/Order";

const triggerInsteadOfDeleteItem: Trigger = async function (inserted, deleted): Promise<void> {

    const items: any[] = await Order.select({items: deleted.id});

    if (items.length > 0) {
        throw new Error("Xảy ra lỗi khi xoá đơn hàng");
    }
}



export default triggerInsteadOfDeleteItem;