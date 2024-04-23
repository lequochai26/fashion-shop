import Item from "../../collections/Item";


export default async function procedureDeleteItem(id:string):Promise<void>{
   
  try {
    await Item.delete(id);
  } catch (error:any) {
    console.error("Lỗi khi xóa ",error);
  }
}