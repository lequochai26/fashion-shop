import Item from "../../collections/Item";

export default async function functionGetLowestItemPrice(): Promise<any[]> {
    const items = (await Item.select()).sort((a,b) => a.price - b.price)

    const LowestPrice: any[] = [];

    if(items.length < 1){
        return LowestPrice;
    }

    const origin = items[0];
    for(const item of items){
        if(item.price !== origin.price){
            break;
        }
        LowestPrice.push(item)
    }

    return LowestPrice
}