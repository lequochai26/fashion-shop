import Item from "../../collections/Item";

export default async function procedureGetItemsWithNameEndWithM(): Promise<any> {
    try {
        
        const items = await Item.select();

        
        const itemsEndWithM = [];

       

        // Lặp qua từng mặt hàng và kiểm tra xem tên của mỗi mặt hàng có kết thúc bằng 'M' hay không
        for (const item of items) {
            // Kiểm tra xem item.name có tồn tại không
            if (item.name && typeof item.name === 'string') {
                const itemNameLowerCase = item.name.toLowerCase();
                if (itemNameLowerCase.endsWith('m')) {
                    itemsEndWithM.push(item);
                }
            }
        }

        return itemsEndWithM;
    } catch (error) {
        console.error("Lỗi:", error);
        throw error;
    }
}
