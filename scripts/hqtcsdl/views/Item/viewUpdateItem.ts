import Item from "../../collections/Item";

export default async function viewUpdateItem(){
    //Lấy danh sách sản phẩm lên
    const items: any[] = await Item.select();

    //Update Item


    //
    return items;

}