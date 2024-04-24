import Item from "../../collections/Item";

export default async function viewHighestItemPrice(): Promise<any[]> {
    // Selecting and sorting desc
    const items: any[] = (await Item.select())
        .sort((a, b) => b.price - a.price);


    const result: any[] = [];


    if (items.length < 1) {
        return result;
    }

    const original = items[0];
    for (const item of items) {

        if (item.price !== original.price) {
            break;

        }
        result.push(item);
    }

    return result;

}
