import ItemType from "../../collections/ItemType";

export default async function procedureUpdateItemTypeWithGivenIdAndName(id: string, name: string): Promise<void> {
    if(!id) {
        throw new Error("Id không được để trống!");
    }

    const itemType =await ItemType.select({id});
    
    if(itemType.length === 0) {
        throw new Error(`Không tồn tại loại sản phẩm có id là: ${id}`);
    }

    if(!name) {
        throw new Error("name không được để trống!");
    }

    if(itemType[0].name === name) {
        throw new Error("Tên loại sản phẩm mới không được trùng với tên loại sản phẩm cũ!");
    }

    await ItemType.update(id, name);
}