import connect from "../Connector";
import triggerForDeleteOrder from "../triggers/Order/triggerForDeleteOrder";
import triggerInsteadOfInsertOrder from "../triggers/Order/triggerInsteadOfInsertOrder";
import triggerInsteadOfUpdateOrder from "../triggers/Order/triggerInsteadOfUpdateOrder";
import Trigger from "../types/Trigger";
import Where from "../types/Where";

export default class Order {
    // Static fields:
    public static collectionName: string = "Order";

    public static insteadOfInsert?: Trigger = triggerInsteadOfInsertOrder;
    public static forInsert?: Trigger;
    public static insteadOfUpdate?: Trigger = triggerInsteadOfUpdateOrder;
    public static forUpdate?: Trigger;
    public static insteadOfDelete?: Trigger = triggerForDeleteOrder;
    public static forDelete?: Trigger = triggerForDeleteOrder;

    // Static methods:
    public static async insert(
        id: string,
        type: string,
        date: Date,
        totalPrice: number,
        status: string,
        paymentMethod: string,
        createdBy?: string | undefined,
        orderedBy?: string | undefined
    ): Promise<void> {
        // Inserted
        const inserted: any = { id, type, date, totalPrice, status, paymentMethod, createdBy, orderedBy };

        // Instead of insert trigger firing
        if (Order.insteadOfInsert) {
            try {
                await Order.insteadOfInsert(inserted, undefined);
            }
            catch (error: any) {
                console.error(error);
                return;
            }
        }

        // Inserting
        const { connection, collection } = await connect(Order.collectionName);
        await collection.insertOne(inserted);
        await connection.close();

        // For insert trigger firing
        if (Order.forInsert) {
            try {
                await Order.forInsert(inserted, undefined);
            }
            catch (error: any) {
                console.error(error);
            }
        }
    }

    public static async update(
        id: string,
        type?: string,
        date?: Date,
        totalPrice?: number,
        status?: string,
        paymentMethod?: string,
        createdBy?: string | undefined,
        orderedBy?: string | undefined
    ): Promise<void> {
        // Connect to db
        const { connection, collection } = await connect(Order.collectionName);

        // Get deleted
        const deleted: any = await collection.findOne({ id });
        if (!deleted) {
            await connection.close();
            return;
        }

        // Get inserting
        const inserted: any = { id, type, date, totalPrice, status, paymentMethod, createdBy, orderedBy };

        // Firing instead of trigger
        if (Order.insteadOfUpdate) {
            try {
                await Order.insteadOfUpdate(inserted, deleted)
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

        // Fiting for trigger
        if (Order.forUpdate) {
            try {
                await Order.forUpdate(inserted, deleted);
            }
            catch (error: any) {
                console.error(error);
            }
        }
    }

    public static async delete(id: string): Promise<void> {
        // Connect to db
        const { connection, collection } = await connect(Order.collectionName);

        // Get deleted
        const deleted: any = await collection.findOne({ id });
        if (!deleted) {
            await connection.close();
            return;
        }

        // Firing instead of trigger
        if (Order.insteadOfDelete) {
            try {
                await Order.insteadOfDelete(undefined, deleted);
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

        // Firing for trigger
        if (Order.forDelete) {
            try {
                await Order.forDelete(undefined, deleted);
            }
            catch (error: any) {
                console.error(error);
            }
        }
    }

    public static async select(
        where?: any | Where
    ): Promise<any[]> {
        // Connect to db
        const { connection, collection } = await connect(Order.collectionName);

        // Result declaration
        let result: any[] = [];

        // Where function case
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