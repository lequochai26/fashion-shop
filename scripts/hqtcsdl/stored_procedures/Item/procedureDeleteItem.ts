import Item from "../../collections/Item";


export default async function procedureDeleteItem(id:string):Promise<void>{
   
  try {
    if((await Item.select({id})).length === 0){
      throw new Error(`Không tồn tại sản phẩm với mã ${id}`)
    }
    await Item.delete(id);
  } catch (error:any) {
    console.error("Lỗi khi xóa ",error);
  }
}