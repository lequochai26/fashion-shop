import Trigger from "../../types/Trigger";

const triggerInsteadOfUpdateBrand: Trigger = async function (inserted, deleted): Promise<void> {
    // Name check
    const newName: string = inserted.name;
    const oldName: string = deleted.name;

    if (newName === oldName) {
        throw new Error(`Tên thương hiệu mới không được trùng với tên thương hiệu cũ!`);
    }

    if (!newName) {
        throw new Error(`Tên thương hiệu mới không thể rỗng!`);
    }
}

export default triggerInsteadOfUpdateBrand;