import connect from "../Connector";
import Trigger from "../types/Trigger";
import Where from "../types/Where";
import triggerForDeleteItem from "../triggers/Item/triggerForDeleteItem";
import triggerInsteadOfDeleteItem from "../triggers/Item/triggerInsteadOfDeleteItem";
import triggerInsteadOfInsertItem from "../triggers/Item/triggerInsteadOfInsertItem";
import triggerInsteadOfUpdateItem from "../triggers/Item/triggerInsteadOfUpdateItem";

export default class Item {
    // Static fields:
    public static collectionName: string = "Item";

    public static insteadOfInsert?: Trigger = triggerInsteadOfInsertItem;
    public static insteadOfUpdate?: Trigger = triggerInsteadOfUpdateItem;
    public static insteadOfDelete?: Trigger = triggerInsteadOfDeleteItem;
    public static forInsert?: Trigger | undefined = undefined;
    public static forUpdate?: Trigger | undefined = undefined;
    public static forDelete?: Trigger = triggerForDeleteItem;

    // Static methods:
    public static async insert(
        id: string,
        name: string,
        description: string,
        price: number,
        buyPrice: number,
        amount: number,
        gender: boolean,
        avatar?: string | undefined,
        metadata?: string | undefined,
        type?: string | undefined,
        brand?: string | undefined
    ): Promise<void> {
        // Avatar default
        if (!avatar) {
            avatar = "/assets/avatar/default.png";
        }

        // Inserted
        const inserted: any = { id, avatar, name, description, price, buyPrice, amount, gender, metadata, type, brand };

        // Firing instead of insert trigger
        if (Item.insteadOfInsert) {
            try {
                await Item.insteadOfInsert(inserted, undefined);
            }
            catch (error: any) {
                console.error(error);
                return;
            }
        }

        // Inserting
        const { connection, collection } = await connect(Item.collectionName);
        await collection.insertOne(inserted);
        await connection.close();

        // Firing for insert trigger
        if (Item.forInsert) {
            try {
                await Item.forInsert(inserted, undefined);
            }
            catch (error: any) {
                console.error(error);
            }
        }
    }

    public static async update(
        id: string,
        avatar?: string,
        name?: string,
        description?: string,
        price?: number,
        buyPrice?: number,
        amount?: number,
        gender?: boolean,
        metadata?: string | undefined,
        type?: string | undefined,
        brand?: string | undefined
    ): Promise<void> {
        // Connect to db
        const { connection, collection } = await connect(Item.collectionName);

        // Get deleted
        const deleted: any = await collection.findOne({ id });
        if (!deleted) {
            await connection.close();
            return;
        }

        // Avatar default
        if (!avatar) {
            avatar = "/assets/avatar/default.png";
        }

        // Get inserted
        const inserted: any = { id, avatar, name, description, price, buyPrice, amount, gender, metadata, type, brand };

        // Firing instead of update trigger
        if (Item.insteadOfUpdate) {
            try {
                await Item.insteadOfUpdate(inserted, deleted);
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
        if (Item.forUpdate) {
            try {
                await Item.forUpdate(inserted, deleted);
            }
            catch (error: any) {
                console.error(error);
            }
        }
    }

    public static async delete(id: string): Promise<void> {
        // Connect to db
        const { connection, collection } = await connect(Item.collectionName);

        // Get deleted
        const deleted: any = await collection.findOne({ id });
        if (!deleted) {
            await connection.close();
            return;
        }

        // Firing instead of delete
        if (Item.insteadOfDelete) {
            try {
                await Item.insteadOfDelete(undefined, deleted);
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
        if (Item.forDelete) {
            try {
                await Item.forDelete(undefined, deleted);
            }
            catch (error: any) {
                console.error(error);
            }
        }
    }

    public static async select(where?: any | Where): Promise<any[]> {
        // Connect to db
        const { connection, collection } = await connect(Item.collectionName);

        // Result declaration
        let result: any[];

        // Querying
        if (!where) {
            result = await collection.find().toArray();
        }
        else if (typeof where == 'function') {
            result = (await collection.find().toArray())
                .filter(where);
        }
        else {
            result = await collection.find(where).toArray();
        }

        // Close connection
        connection.close();

        // Return result
        return result;
    }
}