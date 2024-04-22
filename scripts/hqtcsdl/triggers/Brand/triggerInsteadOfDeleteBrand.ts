import Item from "../../collections/Item";
import Trigger from "../../types/Trigger";

const triggerInsteadOfDeleteBrand: Trigger = async function (inserted, deleted) {
    // Check and make sure less than 100 items
    const items: any[] = await Item.select({ brand: deleted.id });

    if (items.length >= 100) {
        throw new Error(`Thương hiệu này đang có hơn 100 sản phẩm được bán tại cửa hàng, không thể xóa!`);
    }
}

export default triggerInsteadOfDeleteBrand;