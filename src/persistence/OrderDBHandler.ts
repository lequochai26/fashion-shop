import { WithId,Document} from "mongodb";
import DBHandler from "./DBHandler";
import { get, getAll, getByFilter, insert, remove, update } from "./Connector";
import OrderData from "./data/OrderData";
import OrderDataConverter from "./converters/OrderDataConverter";

export default class OrderDBHandler implements DBHandler<OrderData,string>{
    //static fileds các biến được khai báo với từ khóa static trong một lớp. Static fields chỉ có một bản sao duy nhất trong bộ nhớ 
    //và được chia sẻ bởi tất cả các đối tượng của lớp đó
    private static orderData: string = "OrderData";

    //fields
    private OrderDataConverter: OrderDataConverter;

    //constructor
    public constructor(orderDataConverter: OrderDataConverter){
        this.OrderDataConverter = orderDataConverter;
    }

    public async get(pKey: string): Promise<OrderData | undefined> {
        const filter = {
            id: pKey
        }

        //lấy document đầu tiên khớp với pKey (dùng filter) trong db.
        const documentOrder: WithId<Document> | null = await get(
            OrderDBHandler.orderData,
            filter
        );

        //ko co thi return underfined
        if(!documentOrder){
            return;
        }

        //tim document phu hop voi pkey(dung filter)
        //chuyen document sang DTO
        const orderData: OrderData = this.OrderDataConverter.convert(documentOrder);

        //return, ben day chi viec goi ben Converter
        return orderData;
    }

    public async getAll(): Promise<OrderData[]> {
        const documentOrders: WithId<Document>[] = await getAll(
            OrderDBHandler.orderData
        );

         //tao ra 1 list chua dto,dcument la du lieu tho
        const orderList: OrderData[] = [];

        //chuyen doi document sang dữ liệu DTO và thêm vào list
        for(const documentOrder of documentOrders){
            //cd
            const orderData: OrderData = this.OrderDataConverter.convert(documentOrder);
            //add
            orderList.push(orderData);
        }

        return orderList;
    }

    public async getByFilter(filter: any): Promise<OrderData[]> {
        const documentOrders: WithId<Document>[] = await getByFilter(
            OrderDBHandler.orderData,
            filter
        );

         //tao ra 1 list chua dto,dcument la du lieu tho
        const orderList: OrderData[] = [];

        //chuyen doi document sang dữ liệu DTO và thêm vào list
        for(const documentOrder of documentOrders){
            //cd
            const orderData: OrderData = this.OrderDataConverter.convert(documentOrder);
            //add
            orderList.push(orderData);
        }

        return orderList;
    }

    public async insert(target: OrderData): Promise<void> {
        //add, sau khi add thi thoat ra
       return insert(OrderDBHandler.orderData,target);
    }

    public async update(target: OrderData): Promise<void> {
        //Tạo primary cho target(dùng filter để cập nhật document)
        const pKeyItem = { id: target.id };
        return update(OrderDBHandler.orderData,target,pKeyItem);
    }

    public async remove(target: OrderData): Promise<void> {
        return this.removeByPrimaryKey(target.id);
    }

    public async removeByPrimaryKey(pKey: string): Promise<void> {
        //xoa document khớp với primary key
        const primaryKey  = {
            id : pKey,
       };
      return remove(OrderDBHandler.orderData,primaryKey);
    }
    
}