import { Document, WithId } from "mongodb";
import DBHandler from "./DBHandler";
import ItemTypeDataConverter from "./converters/ItemTypeDataConverter";
import ItemTypeData from "./data/ItemTypeData";
import { get, getAll, getByFilter, insert, remove, update } from "./Connector";

export default class ItemTypeDBHandler implements DBHandler<ItemTypeData,string>{
    //static fileds các biến được khai báo với từ khóa static trong một lớp. Static fields chỉ có một bản sao duy nhất trong bộ nhớ 
    //và được chia sẻ bởi tất cả các đối tượng của lớp đó
    private static collectionName: string = "ItemType";
    
    //fields
    private itemTypeDataConverter: ItemTypeDataConverter;
    
    //constructor
    public constructor(itemTypeConverter: ItemTypeDataConverter){
        this.itemTypeDataConverter = itemTypeConverter;
    }
    //method
    public async get(pKey: string): Promise<ItemTypeData | undefined> {
        //tao doi tuong filter (ham get chi nhan 1 doi tuong)
        const filter ={
            id:pKey
        }
        
        //lấy document đầu tiên khớp với pKey (dùng filter) trong db.
        const documentItem: WithId<Document> | null = await get(
            ItemTypeDBHandler.collectionName,filter
        );
        
        //ko co thi return underfined
        if(!documentItem){
            return;
        }
        
        //tim document phu hop voi pkey(dung filter)
        //chuyen document sang DTO
        const itemTypeData: ItemTypeData = this.itemTypeDataConverter.convert(documentItem);
        
        //return, ben day chi viec goi ben Converter
        return itemTypeData;
    }

    public async getAll(): Promise<ItemTypeData[]> {
        const documentItems: WithId<Document>[] = await getAll(
            ItemTypeDBHandler.collectionName
        );
         
        //tao ra 1 list chua dto,dcument la du lieu tho
        const itemTypeList: ItemTypeData[]=[];
        
        //chuyen doi document sang dữ liệu DTO và thêm vào list
        for(const documentItem of documentItems){
            //cd
            const itemTypeData: ItemTypeData = this.itemTypeDataConverter.convert(documentItem);
            //add
            itemTypeList.push(itemTypeData);
        }
        
        return itemTypeList;
    }
    
    public async getByFilter(filter: any): Promise<ItemTypeData[]> {
        const documentItems: WithId<Document>[] = await getByFilter(
            ItemTypeDBHandler.collectionName,filter
        );
        
        //tao ra 1 list chua dto,dcument la du lieu tho
        const itemTypeList: ItemTypeData[]=[];
        
        //chuyen doi document sang dữ liệu DTO và thêm vào list
        for(const documentItem of documentItems){
            //cd
            const itemTypeData: ItemTypeData = this.itemTypeDataConverter.convert(documentItem);
            //add
            itemTypeList.push(itemTypeData);
        }
        
        return itemTypeList;
    }
    
    public async insert(target: ItemTypeData): Promise<void> {
       //add, sau khi add thi thoat ra
       return insert(ItemTypeDBHandler.collectionName,target);
    }
    
    public async update(target: ItemTypeData): Promise<void> {
        //Tạo primary cho target(dùng filter để cập nhật document)
        const pKeyItem = { id: target.id };
        return update(ItemTypeDBHandler.collectionName,target,pKeyItem);
    }
    
    public async remove(target: ItemTypeData): Promise<void> {

        return this.removeByPrimaryKey(target.id);
    }
    
    public async removeByPrimaryKey(pKey: string): Promise<void> {
        //xoa document khớp với primary key
        const primaryKey  = {
            id : pKey,
       };
      
       return remove(ItemTypeDBHandler.collectionName,primaryKey);
    }
    
}