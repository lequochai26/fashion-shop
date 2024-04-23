import Item from "../../collections/Item";

export default async function viewItemsPriceBetween(): Promise<any[]> {
    //Select items
    let items: any[] = await Item.select();

    items = items.filter((item)=> (item.price > 250 && item.price <500));

    return items;
}