import Trigger from "../../types/Trigger";
import OrderItem from "../../collections/OrderItem";

const triggerInsteadOfDeleteItem: Trigger = async function(inserted, deleted): Promise<void>  {
    const items: any[] = await OrderItem.select({orderId: deleted.id});

    if(items.length < 0 ){
        throw new Error("Xảy ra lỗi trong quá trình xoá sản phẩm");
    }
}

export default triggerInsteadOfDeleteItem;