import { Document, WithId } from "mongodb";
import Converter from "../utils/interfaces/Converter";
import DBHandler from "./DBHandler";
import OrderItemData from "./data/OrderItemData";
import OrderItemPrimaryKey from "./pkeys/OrderItemPrimaryKey";
import { get, getAll, getByFilter, insert, remove, update } from "./Connector";

export default class OrderItemDBHandler implements DBHandler<OrderItemData, OrderItemPrimaryKey>{
    //fields:
    private orderItemDataConverter : Converter<WithId<Document>, OrderItemData>;
    private static collectionName : string = "OrderItem";

    //Constructor:
    public constructor(orderItemDataConverter : Converter<WithId<Document>, OrderItemData>){
        this.orderItemDataConverter = orderItemDataConverter;
    }

    //Methods:
    async get(pKey: OrderItemPrimaryKey): Promise<OrderItemData | undefined> {
        const document : WithId<Document> | null = await get(OrderItemDBHandler.collectionName,pKey);

        if(!document){
            return;
        }

        return this.orderItemDataConverter.convert(document);
    }
    async getAll(): Promise<OrderItemData[]> {
        const documents : WithId<Document>[] = await getAll(OrderItemDBHandler.collectionName);

        const orderItemList : OrderItemData[] = [];

        for(const document of documents){
            orderItemList.push(
                this.orderItemDataConverter.convert(document)
            );
        }

        return orderItemList;
    }
    async getByFilter(filter: any): Promise<OrderItemData[]> {
        const documents : WithId<Document>[] = await getByFilter(OrderItemDBHandler.collectionName,filter);

        const orderItemList : OrderItemData[] = [];

        for(const document of documents){
            orderItemList.push(
                this.orderItemDataConverter.convert(document)
            );
        }

        return orderItemList;
    }

    async insert(target: OrderItemData): Promise<void> {
        await insert(OrderItemDBHandler.collectionName,target);
    }
    async update(target: OrderItemData): Promise<void> {
        const pKey : OrderItemPrimaryKey = {
            orderId : target.orderId,
            itemId : target.itemId
        }

        await update(OrderItemDBHandler.collectionName,target,pKey);
    }
    async remove(target: OrderItemData): Promise<void> {
        await this.removeByPrimaryKey(
            {
                orderId: target.orderId,
                itemId: target.itemId
            }
        )
    }
    async removeByPrimaryKey(pKey: OrderItemPrimaryKey): Promise<void> {
        await remove(OrderItemDBHandler.collectionName,pKey);
    }
    
} 