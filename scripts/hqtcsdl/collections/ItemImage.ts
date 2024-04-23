import connect from "../Connector";
import Trigger from "../types/Trigger";
import Where from "../types/Where";
import Item from "./Item";

export default class ItemImage {

    //static fields
    public static collectionName: string = "ItemImage";

    public static insteadOfInsert?: Trigger;
    public static insteadOfUpdate?: Trigger;
    public static insteadOfDelete?: Trigger;
    public static forInsert?: Trigger;
    public static forUpdate?: Trigger;
    public static forDelete?: Trigger;


    //static methods

    public static async insert(
        path: string,
        itemId: string
    ): Promise<void> {
        // Get inserted
        const inserted: any = { path, itemId };

        // Firing instead of insert trigger
        if (ItemImage.insteadOfInsert) {
            try {
                await ItemImage.insteadOfInsert(inserted, undefined);
            }
            catch (error: any) {
                console.error(error);
                return;
            }
        }

        // Inserting
        const { connection, collection } = await connect(ItemImage.collectionName);
        await collection.insertOne(inserted);
        await connection.close();

        // Firing for insert trigger
        if (ItemImage.forInsert) {
            try {
                await ItemImage.forInsert(inserted, undefined);
            }
            catch (error: any) {
                console.error(error);
            }
        }
    }

    //Update
    public static async update(
        path: string,
        itemId: string
    ): Promise<void> {
        // Connect to db
        const { connection, collection } = await connect(ItemImage.collectionName);

        // Get deleted
        const deleted: any = await collection.findOne({ path });
        if (!deleted) {
            await connection.close();
            return;
        }

        // Get inserted
        const inserted: any = { path, itemId };

        // Firing instead of update trigger
        if (ItemImage.insteadOfUpdate) {
            try {
                await ItemImage.insteadOfUpdate(inserted, deleted);
            }
            catch (error: any) {
                console.error(error);
                await connection.close();
                return;
            }
        }

        // Updating
        await collection.updateOne({ path }, { $set: inserted });
        await connection.close();

        // Firing for update trigger
        if (ItemImage.forUpdate) {
            try {
                await ItemImage.forUpdate(inserted, deleted);
            }
            catch (error: any) {
                console.error(error);
            }
        }
    }

    //Delete
    public static async delete(path: string, itemId?: string): Promise<void> {
        // Connect to db
        const { connection, collection } = await connect(ItemImage.collectionName);

        // Get deleted
        const deleted: any = await collection.findOne({
            $and: [
                { path: path },
                { itemId: itemId }
            ]
        });
        if (!deleted) {
            await connection.close();
            return;
        }

        // Deleting
        await collection.deleteOne({ path });
        await connection.close();

        // Firing instead of delete trigger
        if (ItemImage.insteadOfDelete) {
            try {
                await ItemImage.insteadOfDelete(undefined, deleted);
            }
            catch (error: any) {
                console.error(error);
                await connection.close();
                return;
            }
        }
    }

    //Select
    public static async select(where?: any | Where): Promise<any[]> {
        // Connect to db
        const { connection, collection } = await connect(ItemImage.collectionName);

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