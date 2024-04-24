import ItemType from "../../collections/ItemType";
import User from "../../collections/User";

export default async function procedureGetItemTypeWithNameStartByS():Promise<any> {
    return ItemType.select(
        (itemType : any) => (itemType.name as string).toLowerCase().startsWith("s")
    )
}