import connect from "../Connector";
import triggerInsteadOfInsertBrand from "../triggers/Brand/triggerInsteadOfInsertBrand";
import triggerInsteadOfUpdateBrand from "../triggers/Brand/triggerInsteadOfUpdateBrand";
import Trigger from "../types/Trigger";
import Where from "../types/Where";

export default class Brand {
    // Static fields:
    public static collectionName: string = "Brand";

    public static insteadOfInsert?: Trigger = triggerInsteadOfInsertBrand;
    public static insteadOfUpdate?: Trigger = triggerInsteadOfUpdateBrand;
    public static insteadOfDelete?: Trigger;
    public static forInsert?: Trigger;
    public static forUpdate?: Trigger;
    public static forDelete?: Trigger;

    // Static methods:
    public static async insert(
        id: string,
        name: string
    ): Promise<void> {
        // Get inserted
        const inserted: any = { id, name };

        // Firing instead of insert trigger
        if (Brand.insteadOfInsert) {
            try {
                await Brand.insteadOfInsert(inserted, undefined);
            }
            catch (error: any) {
                console.error(error);
                return;
            }
        }

        // Inserting
        const { connection, collection } = await connect(Brand.collectionName);
        await collection.insertOne(inserted);
        await connection.close();

        // Firing for insert trigger
        if (Brand.forInsert) {
            try {
                await Brand.forInsert(inserted, undefined);
            }
            catch (error: any) {
                console.error(error);
            }
        }
    }

    public static async update(
        id: string,
        name?: string
    ): Promise<void> {
        // Connect to db
        const { connection, collection } = await connect(Brand.collectionName);

        // Get deleted
        const deleted: any = await collection.findOne({ id });
        if (!deleted) {
            await connection.close();
            return;
        }

        // Get inserted
        const inserted: any = { id, name };

        // Firing instead of update trigger
        if (Brand.insteadOfUpdate) {
            try {
                await Brand.insteadOfUpdate(inserted, deleted);
            }
            catch (error: any) {
                console.error(error);
                await connection.close();
                return;
            }
        }

        // Updating
        await collection.updateOne({ id }, { $set: inserted });
        await connection.close();

        // Firing for update trigger
        if (Brand.forUpdate) {
            try {
                await Brand.forUpdate(inserted, deleted);
            }
            catch (error: any) {
                console.error(error);
            }
        }
    }

    public static async delete(id: string): Promise<void> {
        // Connect to db
        const { connection, collection } = await connect(Brand.collectionName);

        // Get deleted
        const deleted: any = await collection.findOne({ id });
        if (!deleted) {
            await connection.close();
            return;
        }

        // Firing instead of delete trigger
        if (Brand.insteadOfDelete) {
            try {
                await Brand.insteadOfDelete(undefined, deleted);
            }
            catch (error: any) {
                console.error(error);
                await connection.close();
                return;
            }
        }

        // Deleting
        await collection.deleteOne({ id });
        await connection.close();

        // Firing for delete trigger
        if (Brand.forDelete) {
            try {
                await Brand.forDelete(undefined, deleted);
            }
            catch (error: any) {
                console.error(error);
            }
        }
    }

    public static async select(where?: any | Where): Promise<any[]> {
        // Connect to db
        const { connection, collection } = await connect(Brand.collectionName);

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