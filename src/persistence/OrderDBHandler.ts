import { WithId,Document} from "mongodb";
import DBHandler from "./DBHandler";
import { get, getAll, getByFilter, insert, remove, update } from "./Connector";
import OrderData from "./data/OrderData";
import OrderDataConverter from "./converters/OrderDataConverter";

export default class OrderDBHandler implements DBHandler<OrderData,string>{
    //static fileds các biến được khai báo với từ khóa static trong một lớp. Static fields chỉ có một bản sao duy nhất trong bộ nhớ 
    //và được chia sẻ bởi tất cả các đối tượng của lớp đó
    private static collectionName: string = "Order";

    //fields
    private orderDataConverter: OrderDataConverter;

    //constructor
    public constructor(orderDataConverter: OrderDataConverter){
        this.orderDataConverter = orderDataConverter;
    }

    public async get(pKey: string): Promise<OrderData | undefined> {
        const filter = {
            id: pKey
        }

        //lấy document đầu tiên khớp với pKey (dùng filter) trong db.
        const document: WithId<Document> | null = await get(
            OrderDBHandler.collectionName,
            filter
        );

        //ko co thi return underfined
        if(!document){
            return;
        }

        //tim document phu hop voi pkey(dung filter)
        //chuyen document sang DTO
        const orderData: OrderData = this.orderDataConverter.convert(document);

        //return, ben day chi viec goi ben Converter
        return orderData;
    }

    public async getAll(): Promise<OrderData[]> {
        const documents: WithId<Document>[] = await getAll(
            OrderDBHandler.collectionName
        );

         //tao ra 1 list chua dto,dcument la du lieu tho
        const orderDataList: OrderData[] = [];

        //chuyen doi document sang dữ liệu DTO và thêm vào list
        for(const document of documents){
            //cd
            const orderData: OrderData = this.orderDataConverter.convert(document);
            //add
            orderDataList.push(orderData);
        }

        return orderDataList;
    }

    public async getByFilter(filter: any): Promise<OrderData[]> {
        const documents: WithId<Document>[] = await getByFilter(
            OrderDBHandler.collectionName,
            filter
        );

         //tao ra 1 list chua dto,dcument la du lieu tho
        const orderDataList: OrderData[] = [];

        //chuyen doi document sang dữ liệu DTO và thêm vào list
        for(const document of documents){
            //cd
            const orderData: OrderData = this.orderDataConverter.convert(document);
            //add
            orderDataList.push(orderData);
        }

        return orderDataList;
    }

    public async insert(target: OrderData): Promise<void> {
        //add, sau khi add thi thoat ra
       return insert(OrderDBHandler.collectionName,target);
    }

    public async update(target: OrderData): Promise<void> {
        //Tạo primary cho target(dùng filter để cập nhật document)
        const pKeyItem = { id: target.id };
        return update(OrderDBHandler.collectionName,target,pKeyItem);
    }

    public async remove(target: OrderData): Promise<void> {
        return this.removeByPrimaryKey(target.id);
    }

    public async removeByPrimaryKey(pKey: string): Promise<void> {
        //xoa document khớp với primary key
        const primaryKey  = {
            id : pKey,
       };
      return remove(OrderDBHandler.collectionName,primaryKey);
    }
    
}