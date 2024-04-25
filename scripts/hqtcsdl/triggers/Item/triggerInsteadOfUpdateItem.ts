import Brand from "../../collections/Brand";
import Item from "../../collections/Item";
import ItemType from "../../collections/ItemType";
import Trigger from "../../types/Trigger";
const triggerInsteadOfUpdateItem: Trigger = async function (inserted, deleted): Promise<void> {

    //Kiểm tra tên
    const name: string = inserted.name;
    if (name) {
        if (!name) {
            throw new Error("Tên sản phẩm không được rỗng")
        }
    }


    //kiểm tra mô tả
    const description: string = inserted.description;
    if (description) {
        if (!description) {
            throw new Error(" không được để trống mô tả")
        }
    }


    //kiểm tra giá
    const price: number = inserted.price;
    if (price < 0) {
        throw new Error("Giá bán phải lớn hơn không")
    }

    //priceBuy check
    const buyPrice: number = inserted.buyPrice;
    if (buyPrice < 0) {
        throw new Error("Giá mua lại phải lớn hơn không")
    }

    //kiểm tra số lượng
    const amount: number = inserted.amount;
    if (amount < 0) {
        throw new Error(" số lượng phải lớn hơn không")
    }

    //Kiểm tra type
    const type: string | undefined = inserted.type;
    if (type) {
        const [itemType] = await ItemType.select({ id: type });
        if (!itemType) {
            throw new Error(`Loại sản phẩm với mã "${type}" không tồn tại`)
        }

    }

    //Kiểm tra brand
    const brand: string | undefined = inserted.type;
    if (brand) {
        const [idBrand] = await Brand.select({ id: brand });
        if (!idBrand) {
            throw new Error(`Thương hiệu với mã "${brand}" không tồn tại`)
        }
    }
}
export default triggerInsteadOfUpdateItem;