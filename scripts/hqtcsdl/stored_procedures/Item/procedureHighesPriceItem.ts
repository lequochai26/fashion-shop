import Item from "../../collections/Item";

export default async function procedureGetHighestItemPrice(): Promise<any> {
    // Selecting and sorting desc
    const items: any[] = (await Item.select())
        .sort((a, b) => b.price - a.price);

    // Get highest price item
    const highestPriceItem = items[0];

    // Return highest price item
    return highestPriceItem;
}
