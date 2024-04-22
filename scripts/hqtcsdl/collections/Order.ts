import connect, { DBConnectPath } from "../Connector";
import precheckOrderIdTrigger from "../triggers/Order/precheckOrderIdTrigger";
import Trigger from "../types/Trigger";

export default class Order {
    // Static fields:
    public static collectionName: string = "Order";

    public static triggers: Trigger[] = [
        precheckOrderIdTrigger
    ];

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

        // Instead of triggers executing
        try {
            for (const trigger of Order.triggers) {
                if (trigger.type === "insteadOf") {
                    await trigger.callback(inserted);
                }
            }
        }
        catch (error: any) {
            console.log(error);
        }

        // Inserting
        const { connection, collection }: DBConnectPath = await connect(Order.collectionName);
        await collection.insertOne({ id, type, date, totalPrice, status, paymentMethod, createdBy, orderedBy });

        await connection.close();

        // For triggers executing
        try {
            for (const trigger of Order.triggers) {
                if (trigger.type === "for") {
                    await trigger.callback(inserted)
                }
            }
        }
        catch (error: any) {
            console.log(error.message);
        }
    }
}