import { Document,WithId } from "mongodb";
import Converter from "../utils/interfaces/Converter";
import DBHandler from "./DBHandler";
import OrderData from "./data/OrderData";
import OrderPrimaryKey from "./pkeys/OrderPrimaryKey";
import { get, getAll, getByFilter, insert, remove } from "./Connector";


export default class OrderDBHandler implements DBHandler<OrderData,OrderPrimaryKey>{
    //feilds
    private orderDataConverter: Converter<WithId<Document>,OrderData>;

    //constructor
    public constructor(orderDataConverter:Converter<WithId<Document>,OrderData>){
        this.orderDataConverter=orderDataConverter;
    }

    async get(pKey: OrderPrimaryKey): Promise<OrderData | undefined> {
        
    const document: WithId<Document>| null = await get("Order",pKey);
        if(!document){ 
            return;
        }
        return this.orderDataConverter.convert(document);
    }
    
    //getAll
    async getAll(): Promise<OrderData[]> {
        const documents: WithId<Document>[]= await getAll("Order")
        const orderDataList:OrderData[]=[];

        for(const document of documents){
            orderDataList.push(
                this.orderDataConverter.convert(document)
            );
        }
        return orderDataList;
    }

    
    async getByFilter(filter: any): Promise<OrderData[]> {
        const documents: WithId<Document>[]= await getByFilter("Order",filter)
        const orderDataList:OrderData[]=[];

        for(const document of documents){
            orderDataList.push(
                this.orderDataConverter.convert(document)
            );
        }
        return orderDataList;    
    }


    async insert(target: OrderData): Promise<void> {
        await insert("Order",target);
    }


    async update(target: OrderData): Promise<void> {
        const pKey: OrderPrimaryKey={
            id: target.id,
        }
    }


    async remove(target: OrderData): Promise<void> {
        const pKey: OrderPrimaryKey={
            id: target.id,
        }
        await this.removeByPrimaryKey(pKey);
    }


    async removeByPrimaryKey(pKey: OrderPrimaryKey): Promise<void> {
        await remove("Order",pKey)
    }

}