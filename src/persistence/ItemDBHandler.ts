import { WithId,Document} from "mongodb";
import DBHandler from "./DBHandler";
import ItemDataConverter from "./converters/ItemDataConverter";
import ItemData from "./data/ItemData";
import { get, getAll, getByFilter, insert, remove, update } from "./Connector";

export default class ItemDBHandler implements DBHandler<ItemData,string>{
    //static fileds các biến được khai báo với từ khóa static trong một lớp. Static fields chỉ có một bản sao duy nhất trong bộ nhớ 
    //và được chia sẻ bởi tất cả các đối tượng của lớp đó
    private static itemData: string = "ItemData";
    //fields
    private itemDataConverter: ItemDataConverter;
    //constructor
    public constructor(itemDataConverter: ItemDataConverter){
        this.itemDataConverter = itemDataConverter;
    }
    public async get(pKey: string): Promise<ItemData | undefined> {
        const filter = {
            id: pKey
        };

        //lấy document đầu tiên khớp với pKey (dùng filter) trong db.
        const documentItem: WithId<Document> | null = await get(
            ItemDBHandler.itemData,
            filter
        );

        //ko co thi return underfined
        if(!documentItem){
            return;
        }

        //tim document phu hop voi pkey(dung filter)
        //chuyen document sang DTO
        const itemData: ItemData = this.itemDataConverter.convert(documentItem);
        
        //return, ben day chi viec goi ben Converter
        return itemData;
    }
    public async getAll(): Promise<ItemData[]> {
        const documentItems: WithId<Document>[] = await getAll(
            ItemDBHandler.itemData
        );
         //tao ra 1 list chua dto,dcument la du lieu tho
        const itemList: ItemData[]=[];
        //chuyen doi document sang dữ liệu DTO và thêm vào list
        for(const documentItem of documentItems){
            //cd
            const brandData: ItemData = this.itemDataConverter.convert(documentItem);
            //add
            itemList.push(brandData);
        }
        return itemList;
    }
    public async getByFilter(filter: any): Promise<ItemData[]> {
        const documentItems: WithId<Document>[] = await getByFilter(
            ItemDBHandler.itemData,filter
        );
         //tao ra 1 list chua dto,dcument la du lieu tho
        const itemList: ItemData[]=[];
        //chuyen doi document sang dữ liệu DTO và thêm vào list
        for(const documentItem of documentItems){
            //cd
            const itemData: ItemData = this.itemDataConverter.convert(documentItem);
            //add
            itemList.push(itemData);
        }
        return itemList;
    }
    public async insert(target: ItemData): Promise<void> {
        //add, sau khi add thi thoat ra
       return insert(ItemDBHandler.itemData,target);
    }
    public async update(target: ItemData): Promise<void> {
        //Tạo primary cho target(dùng filter để cập nhật document)
        const pKeyItem = { id: target.id };
        return update(ItemDBHandler.itemData,target,pKeyItem);
    }
    public async remove(target: ItemData): Promise<void> {
        return this.removeByPrimaryKey(target.id);
    }
    public async removeByPrimaryKey(pKey: string): Promise<void> {
        //xoa document khớp với primary key
        const primaryKey  = {
            id : pKey,
       };
      return remove(ItemDBHandler.itemData,primaryKey);
    }
    
}