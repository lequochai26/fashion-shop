import { Collection, Db, MongoClient } from 'mongodb';
import settings from '../src/settings.json';
import { config } from 'dotenv';

// Main function:
async function main(): Promise<void> {
    // .env config
    config();

    // Get DB's url
    const url: string = process.env.URL as string;

    // Get DB's name
    const dbName: string = process.env.DBNAME as string;

    // Connect to DB's service
    const connection: MongoClient = await MongoClient.connect(url);

    // Access to DB with given dbName
    const db: Db = connection.db(dbName);

    // User collection setup
    const userCollection: Collection = await db.createCollection("User");
    await userCollection.createIndex(
        { email: 1 },
        {
            unique: true,
            name: "pk_User_email"
        }
    );

    // VerificationCode collection setup
    const verificationCodeCollection: Collection = await db.createCollection("VerificationCode");
    await verificationCodeCollection.createIndex(
        { email: 1, code: 1 },
        {
            unique: true,
            sparse: true,
            name: "pk_VerificationCode_email_code"
        }
    );

    // ItemImage collection setup
    const itemImageCollection: Collection = await db.createCollection("ItemImage");
    await itemImageCollection.createIndex(
        { itemId: 1, path: 1 },
        {
            unique: true,
            sparse: true,
            name: "pk_ItemImage_itemId_path"
        }
    );

    // Item collection setup
    const itemCollection: Collection = await db.createCollection("Item");
    await itemCollection.createIndex(
        { id: 1 },
        {
            unique: true,
            name: "pk_Item_id"
        }
    );

    // Brand collection setup
    const brandCollection: Collection = await db.createCollection("Brand");
    await brandCollection.createIndex(
        { id: 1 },
        {
            unique: true,
            name: "pk_Brand_id"
        }
    );

    // CartItem collection setup
    const cartItemCollection: Collection = await db.createCollection("CartItem");
    await cartItemCollection.createIndex(
        { email: 1, itemId: 1 },
        {
            unique: true,
            name: "pk_CartItem_email_itemId"
        }
    );

    // ItemType collection setup
    const itemTypeCollection: Collection = await db.createCollection("ItemType");
    await itemTypeCollection.createIndex(
        { id: 1 },
        {
            unique: true,
            name: "pk_ItemType_id"
        }
    );

    // Order collection setup
    const orderCollection: Collection = await db.createCollection("Order");
    await orderCollection.createIndex(
        { id: 1 },
        {
            unique: true,
            name: "pk_Order_id"
        }
    );

    // OrderItem collection setup
    const orderItemCollection: Collection = await db.createCollection("OrderItem");
    await orderItemCollection.createIndex(
        { orderId: 1, itemId: 1 },
        {
            unique: true,
            name: "pk_OrderItem_orderItem_itemId"
        }
    );

    // Close connection
    await connection.close();
}

// Execution:
main()
.then(
    function () {
        console.log(`${settings.name}'s Database Built Successfully!`);
    }
)
.catch(
    function (error: any) {
        console.error(error);
    }
)