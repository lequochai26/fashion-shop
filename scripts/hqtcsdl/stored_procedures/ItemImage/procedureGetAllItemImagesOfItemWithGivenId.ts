import Item from "../../collections/Item";
import ItemImage from "../../collections/ItemImage";

export default async function procedureGetAllItemImagesOfItemWithGivenId(id:string):Promise<any> {
    if(!id){
        throw new Error("Chưa cung cấp ID!");
    }

    if((await Item.select({id})).length ===0){
        throw new Error(`Khong tồn tại sản phẩm có id là ${id}`);
    }

    return ItemImage.select({itemId:id});
}