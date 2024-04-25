import Trigger from "../../types/Trigger";
import OrderItem from "../../collections/OrderItem";

const triggerInsteadOfDeleteItem: Trigger = async function (inserted, deleted): Promise<void> {

    const items: any[] = await OrderItem.select({itemId: deleted.id});

    if (items.length > 0) {
        throw new Error("Sản phẩm có liên kết với đơn hàng không thể xoá!");
    }
}



export default triggerInsteadOfDeleteItem;