import { config } from "dotenv";
import { Collection, Db, MongoClient } from "mongodb";

config();

const url: string = process.env.URL as string;
const dbName: string = process.env.DB_NAME as string;

export default async function connect(collectionName: string): Promise<DBConnectPath> {
    // Connect to db's service
    const connection: MongoClient = await MongoClient.connect(url);

    // Access db
    const db: Db = connection.db(dbName);

    // Access collection
    const collection: Collection = db.collection(collectionName);

    // Return path
    return { collection, db, connection };
}

export interface DBConnectPath {
    connection: MongoClient;
    db: Db;
    collection: Collection
}