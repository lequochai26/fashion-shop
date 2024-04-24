import Item from "../../collections/Item";
import Trigger from "../../types/Trigger";

const triggerForDeleteItemType: Trigger = async function (inserted,deleted) {
    //Cập nhật itemtye field của Items thuộc ItemType này thành undefined
    const items: any[] = await Item.select({type : deleted.id});

    for (const item of items){
        await Item.update(
            item.id,
            item.avatar,
            item.name,
            item.description,
            item.price,
            item.buyPrice,
            item.amount,
            item.gender,
            item.metadata,
            item.brand,
            undefined
        );
    }
}

export default triggerForDeleteItemType;