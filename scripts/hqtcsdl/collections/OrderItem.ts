import connect from "../Connector";
import triggerForDeleteOrder from "../triggers/Order/triggerForDeleteOrder";
import Trigger from "../types/Trigger";
import Where from "../types/Where";

export default class OrderItem{
    //static fields
    public static collectionName: string = "OrderItem";

    public static insteadOfInsert?: Trigger;
    public static forInsert?: Trigger;
    public static insteadOfUpdate?: Trigger;
    public static forUpdate?: Trigger;
    public static insteadOfDelete?: Trigger;
    public static forDelete?: Trigger;


    //static methods
    public static async insert(
        orderId: string,
        itemId: string,
        amount: number,
        price: number,
        metadata: any,
    ): Promise<void> {
        // Inserted
        const inserted: any = { orderId,itemId,amount,price,metadata};

        // Instead of insert trigger firing
        if (OrderItem.insteadOfInsert) {
            try {
                await OrderItem.insteadOfInsert(inserted, undefined);
            }
            catch (error: any) {
                console.error(error);
                return;
            }
        }

        // Inserting
        const { connection, collection } = await connect(OrderItem.collectionName);
        await collection.insertOne(inserted);
        await connection.close();

        // For insert trigger firing
        if (OrderItem.forInsert) {
            try {
                await OrderItem.forInsert(inserted, undefined);
            }
            catch (error: any) {
                console.error(error);
            }
        }
    }

    public static async update(
        orderId: string,
        itemId: string,
        amount: number,
        price: number,
    ): Promise<void> {
        // Connect to db
        const { connection, collection } = await connect(OrderItem.collectionName);

        // Get deleted
        const deleted: any = await collection.findOne({ $and:[{orderId: orderId},{itemId: itemId}] });
        if (!deleted) {
            await connection.close();
            return;
        }

        // Get inserting
        const inserted: any = { orderId,itemId,amount,price }
        // Firing instead of trigger
        if (OrderItem.insteadOfUpdate) {
            try {
                await OrderItem.insteadOfUpdate(inserted, deleted)
            }
            catch (error: any) {
                console.error(error);
                await connection.close();
                return;
            }
        }

        // Updating
        await collection.updateOne({ $and:[{orderId:orderId},{itemId:itemId}] },{ $set: inserted });
        await connection.close();

        // Fiting for trigger
        if (OrderItem.forUpdate) {
            try {
                await OrderItem.forUpdate(inserted, deleted);
            }
            catch (error: any) {
                console.error(error);
            }
        }
    }

    public static async delete(orderId:string, itemId: string):Promise<void>{
        //connect database
        const { connection, collection } = await connect(OrderItem.collectionName);

        //get delete
        const deleted: any = await collection.findOne({ $and:[{orderId:orderId},{itemId:itemId}] });
        
        if(!deleted){
            await connection.close();
            return;
        }

        if(OrderItem.insteadOfDelete){
            try{
                await OrderItem.insteadOfDelete(undefined,deleted);
            }
            catch (error: any) {
                console.error(error);
                await connection.close();
                return;
            }
        }

        await collection.deleteOne({ $and:[{orderId:orderId},{itemId:itemId}] });
        await connection.close();

    
        if (OrderItem.forDelete) {
            try {
                await OrderItem.forDelete(undefined, deleted);
            }
            catch (error: any) {
                console.error(error);
            }
        }

    }

    public static async select(where?: any | Where): Promise<any[]>{
        const { connection, collection} = await connect(OrderItem.collectionName);

        let result: any[] = [];

        if(!where){
            result = await collection.find().toArray();
        }

        else if(typeof where === 'function'){
            result = (await collection.find().toArray()).filter(where);
        }

        else{
            result = await collection.find(where).toArray();
        }

        await connection.close();

        return result;

    }
}