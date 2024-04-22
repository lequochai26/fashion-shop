import Brand from "../../collections/Brand";
import Trigger from "../../types/Trigger";

const triggerInsteadOfInsertBrand: Trigger = async function (inserted, deleted): Promise<void> {
    // id check
    const id: string = inserted.id;
    if (!id) {
        throw new Error(`Mã thương hiệu không được rỗng!`);
    }

    if ((await Brand.select({ id })).length > 0) {
        throw new Error(`Đã tồn tại thương hiệu với mã ${id} !`);
    }

    // name check
    const name: string = inserted.name;
    if (!name) {
        throw new Error(`Tên thương hiệu không được rỗng!`);
    }
}

export default triggerInsteadOfInsertBrand;