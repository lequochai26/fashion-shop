import Item from "../../collections/Item";

export default async function procedureTop10LowestPriceItem(): Promise<any[]> {
    // Selecting and sorting asc
    const items: any[] = (await Item.select())
        .sort((a,b) => a.price - b.price);

    // Get top 10
    items.splice(10);

    // Return items
    return items;
}