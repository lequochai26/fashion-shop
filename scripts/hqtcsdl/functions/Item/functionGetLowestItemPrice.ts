import Item from "../../collections/Item";

export default async function functionGetLowestItemPrice(): Promise<any> {
    const item = (await Item.select()).sort((a,b) => a.price - b.price)

    const MinPrice = item[0];

    return MinPrice;
}