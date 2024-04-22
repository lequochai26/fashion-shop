import connect from "../Connector";
import Trigger from "../types/Trigger";
import Where from "../types/Where";

export default class User {
    // Static fields:
    public static collectionName: string = "User";

    public static insteadOfInsert?: Trigger;
    public static insteadOfUpdate?: Trigger;
    public static insteadOfDelete?: Trigger;
    public static forInsert?: Trigger;
    public static forUpdate?: Trigger;
    public static forDelete?: Trigger;

    // Static methods:
    public static async insert(
        email: string,
        password: string,
        fullName: string,
        gender: boolean,
        phoneNumber: string,
        address: string,
        avatar: string,
        permission: string,
        wallet?: string | undefined
    ): Promise<void> {
        // Get inserted
        const inserted: any = { email, password, fullName, gender, phoneNumber, address, avatar, permission, wallet };

        // Firing instead of insert trigger
        if (User.insteadOfInsert) {
            try {
                await User.insteadOfInsert(inserted, undefined);
            }
            catch (error: any) {
                console.error(error);
                return;
            }
        }

        // Inserting
        const { connection, collection } = await connect(User.collectionName);
        await collection.insertOne(inserted);
        await connection.close();

        // Firing for insert trigger
        if (User.forInsert) {
            try {
                await User.forInsert(inserted, undefined);
            }
            catch (error: any) {
                console.error(error);
            }
        }
    }

    public static async update(
        email: string,
        password?: string,
        fullName?: string,
        gender?: boolean,
        phoneNumber?: string,
        address?: string,
        avatar?: string,
        permission?: string,
        wallet?: string | undefined
    ): Promise<void> {
        // Connect to db
        const { connection, collection } = await connect(User.collectionName);

        // Get deleted
        const deleted: any = await collection.findOne({ email });
        if (!deleted) {
            await connection.close();
            return;
        }

        // Get inserted
        const inserted: any = { email, password, fullName, gender, phoneNumber, address, avatar, permission, wallet };

        // Firing instead of update trigger
        if (User.insteadOfUpdate) {
            try {
                await User.insteadOfUpdate(inserted, deleted);
            }
            catch (error: any) {
                console.error(error);
                await connection.close();
                return;
            }
        }

        // Updating
        await collection.updateOne({ email }, { $set: inserted });
        await connection.close();

        // Firing for update trigger
        if (User.forUpdate) {
            try {
                await User.forUpdate(inserted, deleted);
            }
            catch (error: any) {
                console.error(error);
            }
        }
    }

    public static async delete(email: string): Promise<void> {
        // Connect to db
        const { connection, collection } = await connect(User.collectionName);

        // Get deleted
        const deleted: any = await collection.findOne({ email });
        if (!deleted) {
            await connection.close();
            return;
        }

        // Firing instead of delete trigger
        if (User.insteadOfDelete) {
            try {
                await User.insteadOfDelete(undefined, deleted);
            }
            catch (error: any) {
                console.error(error);
                await connection.close();
                return;
            }
        }

        // Deleting
        await collection.deleteOne({ email });
        await connection.close();

        // Firing for delete trigger
        if (User.forDelete) {
            try {
                await User.forDelete(undefined, deleted);
            }
            catch (error: any) {
                console.error(error);
            }
        }
    }

    public static async select(where?: any | Where): Promise<any[]> {
        // Connect to db
        const { connection, collection } = await connect(User.collectionName);

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