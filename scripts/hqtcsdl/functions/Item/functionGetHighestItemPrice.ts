import Item from "../../collections/Item";

export default async function functionGetHighestItemPrice(): Promise<any> {
    const items = await Item.select(); // Lấy tất cả các sản phẩm từ cơ sở dữ liệu

    // Sắp xếp các sản phẩm theo giá giảm dần
    items.sort((a, b) => b.price - a.price);

    // Lấy sản phẩm có giá cao nhất (đầu mảng sau khi đã sắp xếp)
    const highestPricedItem = items[0];

    return highestPricedItem;
}