import Item from "../../collections/Item";


export default async function procedureDeleteItem(id:string):Promise<void>{
   
  try {
    if(!await Item.select({id})){
      throw new Error(`Không tồn tại sản phẩm với mã ${id}`)
    }
    return Item.delete(id);
  } catch (error:any) {
    console.error("Lỗi khi xóa ",error);
  }
}