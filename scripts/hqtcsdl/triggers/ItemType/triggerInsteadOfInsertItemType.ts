import ItemType from "../../collections/ItemType";
import Trigger from "../../types/Trigger";

const triggerInsteadOfInsertItemType: Trigger = async function (inserted,deleted):Promise<void> {
    // id
    const id : string = inserted.id;

    if((await ItemType.select({id})).length>0){
        throw new Error(`Đã tồn tại loại sản phẩm với mã ${id}!`);
    }

    //name
    const name : string = inserted.name;
    if(!name){
        throw new Error("Tên loại sản phẩm không được rỗng !");
        
    }
}

export default triggerInsteadOfInsertItemType;