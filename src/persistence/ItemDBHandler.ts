import { WithId,Document} from "mongodb";
import DBHandler from "./DBHandler";
import ItemDataConverter from "./converters/ItemDataConverter";
import ItemData from "./data/ItemData";
import { get, getAll, getByFilter, insert, remove, update } from "./Connector";

export default class ItemDBHandler implements DBHandler<ItemData,string>{
    //static fileds các biến được khai báo với từ khóa static trong một lớp. Static fields chỉ có một bản sao duy nhất trong bộ nhớ 
    //và được chia sẻ bởi tất cả các đối tượng của lớp đó
    private static collectionName: string = "Item";

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
        const document: WithId<Document> | null = await get(
            ItemDBHandler.collectionName,
            filter
        );

        //ko co thi return underfined
        if(!document){
            return;
        }

        //tim document phu hop voi pkey(dung filter)
        //chuyen document sang DTO
        const itemData: ItemData = this.itemDataConverter.convert(document);
        
        //return, ben day chi viec goi ben Converter
        return itemData;
    }
    public async getAll(): Promise<ItemData[]> {
        const documents: WithId<Document>[] = await getAll(
            ItemDBHandler.collectionName
        );
         //tao ra 1 list chua dto,dcument la du lieu tho
        const itemDataList: ItemData[]=[];
        //chuyen doi document sang dữ liệu DTO và thêm vào list
        for(const document of documents){
            //cd
            const itemData: ItemData = this.itemDataConverter.convert(document);
            //add
            itemDataList.push(itemData);
        }
        return itemDataList;
    }
    public async getByFilter(filter: any): Promise<ItemData[]> {
        const documents: WithId<Document>[] = await getByFilter(
            ItemDBHandler.collectionName,filter
        );
         //tao ra 1 list chua dto,dcument la du lieu tho
        const itemDataList: ItemData[]=[];
        //chuyen doi document sang dữ liệu DTO và thêm vào list
        for(const document of documents){
            //cd
            const itemData: ItemData = this.itemDataConverter.convert(document);
            //add
            itemDataList.push(itemData);
        }
        return itemDataList;
    }
    public async insert(target: ItemData): Promise<void> {
        //add, sau khi add thi thoat ra
       return insert(ItemDBHandler.collectionName,target);
    }
    public async update(target: ItemData): Promise<void> {
        //Tạo primary cho target(dùng filter để cập nhật document)
        const pKeyItem = { id: target.id };
        return update(ItemDBHandler.collectionName,target,pKeyItem);
    }
    public async remove(target: ItemData): Promise<void> {
        return this.removeByPrimaryKey(target.id);
    }
    public async removeByPrimaryKey(pKey: string): Promise<void> {
        //xoa document khớp với primary key
        const primaryKey  = {
            id : pKey,
       };
      return remove(ItemDBHandler.collectionName,primaryKey);
    }
    
}