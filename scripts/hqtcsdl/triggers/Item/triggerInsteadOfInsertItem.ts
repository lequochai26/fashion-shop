import Brand from "../../collections/Brand";
import Item from "../../collections/Item";
import ItemType from "../../collections/ItemType";
import Trigger from "../../types/Trigger";

const triggerInsteadOfInsertItem: Trigger = async function (inserted, deleted): Promise<void> {

    //kiểm tra 
    const id: string = inserted.id;
    const name: string = inserted.name;
    const description: string = inserted.description;
    const price: number = inserted.price;
    const buyPrice: number = inserted.buyPrice;
    const amount: number = inserted.amount;
    const type: string | undefined = inserted.type;
    const brand: string | undefined = inserted.brand;


    //Kiểm tra id
    if (!id) {
        throw new Error("mã sản phẩm không được rỗng!");
    }

    if ((await Item.select({ id })).length > 0) {
        throw new Error(`Đã tồn tại sản phẩm với mã ${id} !`);
    }

    //Kiểm tra tên
    if (!name) {
        throw new Error(`Tên sản phẩm không được rỗng!`);
    }

    //kiểm tra giá
    if (price < 0) {
        throw new Error("Giá bán phải lớn hơn không")
    }

    //priceBuy check
    if (buyPrice < 0) {
        throw new Error("Giá mua lại phải lớn hơn không")
    }
    //kiểm tra số lượng
    if (amount < 0) {
        throw new Error("Số lượng phải lớn hơn không")
    }

    //kiểm tra mô tả
    if (!description) {
        throw new Error("Không được để trống mô tả")
    }

    if (type) {
        const [itemType] = await ItemType.select({ id: type });
        if (!itemType) {
            throw new Error(`Loại sản phẩm với mã "${type}" không tồn tại`)
        }

    }

    if (brand) {
        const [idBrand] = await Brand.select({ id: brand });
        if (!idBrand) {
            throw new Error(`Thương hiệu với mã "${brand}" không tồn tại`)
        }

    }
}

export default triggerInsteadOfInsertItem;
