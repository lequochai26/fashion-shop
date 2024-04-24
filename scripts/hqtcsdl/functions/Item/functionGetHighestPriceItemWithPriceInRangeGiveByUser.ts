import Item from "../../collections/Item";

export default async function functionGetHighestPriceItemWithPriceInRangeGiveByUser(from: number, to: number): Promise<any[]> {
    // Kiểm tra nếu from lớn hơn to thì xuất thông báo lỗi
    if (from > to) {
        throw new Error(" giá trị đầu vào không hợp lệ!");
    }

    // Lọc ra danh sách có mức giá trong khoảng được chỉ định (>= from, <= to)
    const itemsInRange = await Item.select({
        price: { $gte: from, $lte: to }
    });

    // Nếu không có sản phẩm nào trong khoảng giá trị, trả về mảng rỗng
    if (itemsInRange.length === 0) {
        return [];
    }

    // Tìm sản phẩm có giá cao nhất trong danh sách đã lọc
    let highestPricedItems: any[] = [itemsInRange[0]]; // Khởi tạo mảng với phần tử đầu tiên

    for (let i = 1; i < itemsInRange.length; i++) {
        const currentItem = itemsInRange[i];
        if (currentItem.price === highestPricedItems[0].price) {
            // Nếu giá của sản phẩm hiện tại bằng giá cao nhất hiện tại, thêm sản phẩm này vào mảng
            highestPricedItems.push(currentItem);
        } else if (currentItem.price > highestPricedItems[0].price) {
            // Nếu giá của sản phẩm hiện tại cao hơn giá cao nhất hiện tại, thì đặt sản phẩm này làm duy nhất trong mảng
            highestPricedItems = [currentItem];
        }
    }

    return highestPricedItems;
}
