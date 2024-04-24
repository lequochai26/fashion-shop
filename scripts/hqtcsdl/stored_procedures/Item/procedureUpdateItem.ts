import Item from "../../collections/Item";

export default async function procedureUpdateItem(id: string):Promise<void> {
    try {
        await Item.update(id);
    } catch (error: any) {
        console.error("Đã xảy ra cập nhật sản phẩm", error);
    }
}