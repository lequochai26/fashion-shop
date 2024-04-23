import connect from "../Connector";
import Trigger from "../types/Trigger";
import Where from "../types/Where";

export default class CartItem {
    //Static fields:
    public static collectionName: string = "CartItem";

    public static insteadOfInsert?: Trigger;
    public static insteadOfUpdate?: Trigger;
    public static insteadOfDelete?: Trigger;
    public static forInsert?: Trigger;
    public static forUpdate?: Trigger;
    public static forDelete?: Trigger;

    //Static methods:
    public static async insert(
        email: string,
        itemId: string,
        amount: number,
        metadata: any
    ): Promise<void> {
        //Get inserted
        const inserted: any = {email, itemId, amount, metadata};

        //Firing instead of insert trigger
        if(CartItem.insteadOfInsert) {
            try {
                await CartItem.insteadOfInsert(inserted, undefined);
            } catch (error: any) {
                console.error(error);
                return;
            }
        }

        //Inserting
        const { connection, collection} = await connect(CartItem.collectionName);
        await collection.insertOne(inserted);
        await connection.close();

        // Firing for insert trigger
        if (CartItem.forInsert) {
            try {
                await CartItem.forInsert(inserted, undefined);
            }
            catch (error: any) {
                console.error(error);
            }
        }
    }

    public static async update(
        email: string,
        itemId: string,
        amount: number,
    ): Promise<void> {
        // Connect to db
        const { connection, collection } = await connect(CartItem.collectionName);

        // Get deleted
        const deleted: any = await collection.findOne({ 
            $and: [
                {email: email},
                {itemId: itemId}
            ]
         });

        if (!deleted) {
            await connection.close();
            return;
        }

        // Get inserted
        const inserted: any = { email, itemId, amount };

        // Firing instead of update trigger
        if (CartItem.insteadOfUpdate) {
            try {
                await CartItem.insteadOfUpdate(inserted, deleted);
            }
            catch (error: any) {
                console.error(error);
                await connection.close();
                return;
            }
        }

        // Updating
        await collection.updateOne({ $and: [
            {email: email},
            {itemId: itemId}
        ] }, { $set: inserted });
        await connection.close();

        // Firing for update trigger
        if (CartItem.forUpdate) {
            try {
                await CartItem.forUpdate(inserted, deleted);
            }
            catch (error: any) {
                console.error(error);
            }
        }
    }

    public static async delete(email: string, itemId?: string): Promise<void> {
        // Connect to db
        const { connection, collection } = await connect(CartItem.collectionName);

        // Get deleted
        const deleted: any = await collection.findOne({$and: [
            {email: email},
            {itemId: itemId}
        ]});
        if (!deleted) {
            await connection.close();
            return;
        }

        // Firing instead of delete trigger
        if (CartItem.insteadOfDelete) {
            try {
                await CartItem.insteadOfDelete(undefined, deleted);
            }
            catch (error: any) {
                console.error(error);
                await connection.close();
                return;
            }
        }

        // Deleting
        
        await collection.deleteOne({ $and: [
            {email: email},
            {itemId: itemId}
        ] });
        await connection.close();

        // Firing for delete trigger
        if (CartItem.forDelete) {
            try {
                await CartItem.forDelete(undefined, deleted);
            }
            catch (error: any) {
                console.error(error);
            }
        }
    }

    public static async select(where?: any | Where): Promise<any[]> {
        // Connect to db
        const { connection, collection } = await connect(CartItem.collectionName);

        // Result declaration
        let result: any[];

        // Selecting
        if (!where) {
            result = await collection.find().toArray();
        }
        else if (typeof where === 'function') {
            result = (await collection.find().toArray())
                .filter(where);
        }
        else {
            result = await collection.find(where).toArray();
        }

        // Close connection
        await connection.close();

        // Return result
        return result;
    }
}