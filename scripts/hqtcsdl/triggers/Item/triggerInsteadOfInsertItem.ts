import Item from "../../collections/Item";
import Trigger from "../../types/Trigger";

const triggerInsteadOfInsertItem: Trigger = async function (inserted, deleted): Promise<void> {

    //kiểm tra 
    const id: string = inserted.id;
    const avatar: string = inserted.id;
    const name: string = inserted.name;
    const description: string = inserted.description;
    const price: number = inserted.price;
    const buyPrice: number = inserted.buyPrice;
    const amount: number = inserted.amount;
    const gender: boolean = inserted.gender;
    const type: string | undefined = inserted.type;
    const brand: string | undefined = inserted.type;


    //Kiểm tra id
    if (!id) {
        throw new Error("mã sản phẩm không được rỗng!");
    }

    if ((await Item.select({ id })).length > 0) {
        throw new Error(`Đã tồn tại sản phẩm với mã ${id} !`);
    }

    //Kiểm tra avatar
    if (!avatar) {
        throw new Error("")
    }

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


    //kiểm tra gender
    if (!gender) {
        throw new Error(" phải chọn giới tính ")
    }

    if (!type) {
        throw new Error(" Phải có loại sản phẩm phù hợp ")

    }

    if(!brand){
        throw new Error ("không được để trống thương hiệu")
    }
}

export default triggerInsteadOfInsertItem;
