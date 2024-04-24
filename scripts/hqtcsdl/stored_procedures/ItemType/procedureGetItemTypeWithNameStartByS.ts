import ItemType from "../../collections/ItemType";


export default async function procedureGetItemTypeWithNameStartByS():Promise<any> {
    return ItemType.select(
        (itemType : any) => (itemType.name as string).toLowerCase().startsWith("s")
    )
}