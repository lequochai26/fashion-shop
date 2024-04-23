import Item from "../../collections/Item";

export default async function procedureGetItemsByKeyWord(keyword: string):Promise<any[]> {
    if(!keyword){
        throw new Error('Chưa cung cấp từ khóa!')
    }
    
    const items = await Item.select()
    const listItems = items.filter((item) => {
        //trả về các item có từ khóa trong tên,không phân biệt hoa hay thường
        return item.name.toLowerCase().includes(keyword.toLowerCase())
    })
    return listItems;
}