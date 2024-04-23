import connect from "../Connector";
import triggerForDeleteItemType from "../triggers/ItemType/triggerForDeleteItemType";
import triggerInsteadOfDeleteItemType from "../triggers/ItemType/triggerInsteadOfDeleteItemType";
import triggerInsteadOfInsertItemType from "../triggers/ItemType/triggerInsteadOfInsertItemType";
import triggerInsteadOfUpdateItemType from "../triggers/ItemType/triggetInsteadOfUpdateItemType";
import Trigger from "../types/Trigger";
import Where from "../types/Where";

export default class ItemType {
    //static
    public static collectionName: string ="ItemType";

    public static insteadOfInsert? : Trigger = triggerInsteadOfInsertItemType ;
    public static insteadOfDelete? : Trigger = triggerInsteadOfDeleteItemType;
    public static insteadOfUpdate? : Trigger = triggerInsteadOfUpdateItemType;
    public static forInsert? : Trigger ;
    public static forUpdate? : Trigger ;
    public static forDelete? : Trigger = triggerForDeleteItemType ;

    //method
    public static async inserrt(
        id : string,
        name : string
    ): Promise<void>{
        //
        const inserted : any ={id,name};

        //
        if(ItemType.insteadOfInsert){
            try {
                await ItemType.insteadOfInsert(inserted,undefined);
            } catch (error:any) {
                console.error(error);
                return;
            }
        }

        //insert
        const {connection,collection} = await connect(ItemType.collectionName);
        await collection.insertOne(inserted);
        await connection.close();

        //
        if(ItemType.forInsert){
            try {
                await ItemType.forInsert(inserted,undefined);
            } catch (error) {
                console.error(error);
                
            }
        }
    }

    //update
    public static async update(
        id:string,
        name?: string
    ):Promise<void>{
        //connect to db
        const {connection,collection} = await connect(ItemType.collectionName); 

        //get delted
        const deleted: any = await collection.findOne({id});
        if(!deleted){
            await connection.close();
            return;
        }

        //get inserted
        const inserted:any = {id,name};

        if(ItemType.insteadOfUpdate){
            try {
                await ItemType.insteadOfUpdate(inserted,undefined);
                
            } catch (error:any) {
                console.error(error);
                await connection.close();
                return;
                
            }
        }

        //updating
        await collection.updateOne({id},{$set: inserted});
        await connection.close();

        //
        if(ItemType.forUpdate){
            try {
                await ItemType.forUpdate(inserted,deleted);
            } catch (error: any) {
                console.error(error);
            }
        }



    }

    public static async delete(id:string):Promise<void>{
        //connect db
        const {connection,collection} = await connect(ItemType.collectionName);

        //get deletd
        const deleted : any = await collection.findOne({id});
        if(!deleted){
            await connection.close();
            return;
        }
        //
        if(ItemType.insteadOfDelete){
            try {
                await ItemType.insteadOfDelete(undefined,deleted);
            } catch (error:any) {
                console.error(error);
                await connection.close();
                return;
            }
        }

        //delete
        await collection.deleteOne({id});
        await connection.close();

        //
        if(ItemType.forDelete){
            try {
                await ItemType.forDelete(undefined,deleted);
            } catch (error:any) {
                console.error(error);
            }
        }

    }

    public static async select(where?: any|Where):Promise<any[]>{
        //connect db
        const {collection,connection} = await connect(ItemType.collectionName);

        //
        let result: any[];
        if(!where){
            result = await collection.find().toArray();
        }else if(typeof where === 'function'){
            result = (await collection.find().toArray()).filter(where);
        }else{
            result = await collection.find(where).toArray();
        }

        //close
        connection.close();

        //return result
        return result;
    }

    
    
}