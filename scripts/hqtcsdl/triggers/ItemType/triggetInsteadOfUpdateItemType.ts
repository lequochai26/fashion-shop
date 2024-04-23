import Trigger from "../../types/Trigger";

const triggerInsteadOfUpdateItemType: Trigger = async function (inserted,deleted): Promise<void> {
    const newName : string = inserted.name;
    const oldName : string = deleted.name;

    if (newName === oldName) {
        throw new Error(`Tên loại sản phẩm mới không được trùng với tên loại sản phẩm cũ!`);
    }

    if (!newName) {
        throw new Error(`Tên loại sản phẩm mới không thể rỗng!`);
    }
}

export default triggerInsteadOfUpdateItemType;