import Trigger from "../../types/Trigger";
const triggerInsteadOfUpdateItem: Trigger = async function (inserted, deleted): Promise<void> {

    
    const name: string = inserted.name;
    const description: string = inserted.description;
    const price: number = inserted.price;
    const buyPrice: number = inserted.buyPrice;
    const amount: number = inserted.amount;
    const type: string | undefined = inserted.type;
    const brand: string | undefined = inserted.type;

    //Kiểm tra tên
    if (!name) {
        throw new Error(`Tên sản phẩm không được rỗng!`);
    }

    //kiểm tra giá
    if (price <= 0) {
        throw new Error("Giá bán phải lớn hơn không")
    }

    //priceBuy check
    if (buyPrice <= 0) {
        throw new Error("Giá mua lại phải lớn hơn không")
    }
    //kiểm tra số lượng
    if (amount <= 0) {
        throw new Error(" số lượng phải lớn hơn không")
    }

    //kiểm tra mô tả
    if (!description) {
        throw new Error(" không được để trống mô tả")
    }

}

export default triggerInsteadOfUpdateItem;