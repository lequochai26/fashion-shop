import Item from "../../collections/Item";

export default async function DeleteItem():Promise<any[]> {
    //select items
    let items: any[] = await Item.select();


    
    return items;
}