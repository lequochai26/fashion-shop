import Item from "../../collections/Item";

export default async function viewGetItemsByKeyWord(keyword: string):Promise<any[]> {
    if(!keyword){
        throw new Error('Chưa cung cấp từ khóa!')
    }
    
    const items = await Item.select()
    const listItems:Item[] = items.filter((item) => {
        //trả về các item có từ khóa trong tên,không phân biệt hoa hay thường
        return item.name.toLowerCase().includes(keyword.toLowerCase())||
        item.id.toLowerCase().includes(keyword.toLowerCase())||
        item.description.toLowerCase().includes(keyword.toLowerCase())||
        item.price === Number(keyword)||
        item.type.toLowerCase().includes(keyword.toLowerCase())||
        item.brand.toLowerCase().includes(keyword.toLowerCase());
    })
    return listItems;
}