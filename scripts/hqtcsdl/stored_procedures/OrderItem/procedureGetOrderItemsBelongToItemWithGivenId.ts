import Item from "../../collections/Item";
import OrderItem from "../../collections/OrderItem";

export default async function procedureGetOrderItemsBelongToItemWithGivenId(id: string): Promise<any> {
    if(!id) {
        throw new Error("Chưa cung cấp id sản phẩm!");
    }

    if((await Item.select({id})).length === 0) {
        throw new Error(`Không tồn tại sản phẩm có id là ${id}`);
    }

    return OrderItem.select({itemId: id});
}