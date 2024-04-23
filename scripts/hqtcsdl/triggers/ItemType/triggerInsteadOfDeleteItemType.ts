import Item from "../../collections/Item";
import Trigger from "../../types/Trigger";

const triggerInsteadOfDeleteItemType: Trigger = async function (inserted,deleted) {
    //select item
    const items: any[] = await Item.select({type: deleted.id});

    if(items.length >=30){
        throw new Error(`Loại sản phẩm này đang có hơn 30 sản phẩm được bán,không thể xóa !`)
    }
}

export default triggerInsteadOfDeleteItemType;