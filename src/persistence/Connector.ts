import { Collection, Db, Document, MongoClient, WithId } from "mongodb";

// URL
const url: string = process.env.URL as string;

// DBNAME
const dbName: string = process.env.DBNAME as string;

// Interfaces:
interface AccessCollectionPath {
    connection: MongoClient;
    db: Db;
    collection: Collection;
}

// Get function
export async function get(collectionName: string, filter: any): Promise<WithId<Document> | null> {
    // Access collection
    const { connection, collection }: AccessCollectionPath = await accessCollection(collectionName);

    // Find one
    try {
        return collection.findOne(filter);
    }
    catch (error: any) {
        connection.close();
        throw error;
    }
}

export async function getAll(collectionName: string): Promise<WithId<Document>[]> {
    // Access collection
    const { connection, collection }: AccessCollectionPath = await accessCollection(collectionName);

    // Find many
    try {
        return collection.find().toArray();
    }
    catch (error: any) {
        connection.close();
        throw error;
    }
}

export async function getByFilter(collectionName: string, filter: any): Promise<WithId<Document>[]> {
    // Access collection
    const { connection, collection }: AccessCollectionPath = await accessCollection(collectionName);

    // Find by filter and return
    try {
        return collection.find(filter).toArray();
    }
    catch (error: any) {
        connection.close();
        throw error;
    }
}

export async function insert(collectionName: string, target: any): Promise<void> {
    // Access collection
    const { connection, collection }: AccessCollectionPath = await accessCollection(collectionName);

    // Insert one
    try {
        await collection.insertOne(target);
    }
    catch (error: any) {
        connection.close();
        throw error;
    }
}

export async function update(collectionName: string, target: any, filter: any): Promise<void> {
    // Access collection
    const { connection, collection }: AccessCollectionPath = await accessCollection(collectionName);

    // Update one
    try {
        await collection.updateOne(filter, {$set: target});
    }
    catch (error: any) {
        connection.close();
        throw error;
    }
}

export async function remove(collectionName: string, filter: any): Promise<void> {
    // Access collection
    const { connection, collection }: AccessCollectionPath = await accessCollection(collectionName);

    // Delete one
    try {
        await collection.deleteOne(filter);
    }
    catch (error: any) {
        connection.close();
        throw error;
    }
}

// Connect DB and access Collection function:
async function accessCollection(collectionName: string): Promise<AccessCollectionPath> {
    // Connect to DB's Service
    const connection: MongoClient = await MongoClient.connect(url);

    // Access to db
    const db: Db = connection.db(dbName);

    // Access to collection with given collection name
    const collection: Collection = db.collection(collectionName);

    // Return path
    return {
        connection: connection,
        db: db,
        collection: collection
    };
}