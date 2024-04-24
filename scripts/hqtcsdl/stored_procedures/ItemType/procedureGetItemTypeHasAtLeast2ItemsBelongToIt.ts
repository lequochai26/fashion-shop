import Item from "../../collections/Item";
import ItemType from "../../collections/ItemType";

export default async function procedureGetItemTypeHasAtLeast2ItemsBelongToIt(): Promise<any[]> {
    let itemTypes = await ItemType.select();
    const result: any[] = [];
    for(const itemType of itemTypes) {
        if((await Item.select({type: itemType.id})).length >= 2) {
            result.push(itemType);
        }
    }

    return result;
}