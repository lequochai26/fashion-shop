import ItemType from "../../collections/ItemType";

export default async function procedureGetBrandsByKeyword(keyword: string): Promise<any[]> {
    try {
        
        if (!keyword) {
            throw new Error('Chưa cung cấp từ khóa tìm kiếm!');
        }

        
        const itemTypes = await ItemType.select();

        const keywordItemTypes = [];

        // Lặp qua từng loại sản phẩm ,kt có từ khóa  không
        for (const itemType of itemTypes) {
            const itemName = itemType.name as string;
            const itemId = itemType.id as string;
            const lowercaseKeyword = keyword.toLowerCase();

          
            if (itemName.toLowerCase().includes(lowercaseKeyword) || itemId.toLowerCase().includes(lowercaseKeyword)) {
             
                keywordItemTypes.push({
                    id: itemId,
                    name: itemName
                });
            }
        }

       
        return keywordItemTypes;
    } catch (error) {
        console.error('Lỗi khi lấy loại sản phẩm theo từ khóa:', error);
        throw error;
    }
}
