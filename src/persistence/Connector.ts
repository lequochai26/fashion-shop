import { config } from "dotenv";
import { Collection, Db, Document, MongoClient, WithId } from "mongodb";

// .env config
config();

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
/**
 * Truy vấn một document khớp với điều kiện được cung cấp.
 * @param collectionName Tên collection
 * @param filter Điều kiện
 * @returns Document khớp với filter được cung cấp hoặc không có document nào khớp cả
 */
export async function get(collectionName: string, filter: any): Promise<WithId<Document> | null> {
    // Access collection
    const { connection, collection }: AccessCollectionPath = await accessCollection(collectionName);

    // Find one
    try {
        const result: WithId<Document> | null = await collection.findOne(filter);

        await connection.close();

        return result;
    }
    catch (error: any) {
        await connection.close();
        throw error;
    }
}

/**
 * Truy vấn tất cả documents thuộc collection được chỉ định.
 * @param collectionName Tên collection
 * @returns Danh sách các documents thuộc collection được chỉ định
 */
export async function getAll(collectionName: string): Promise<WithId<Document>[]> {
    // Access collection
    const { connection, collection }: AccessCollectionPath = await accessCollection(collectionName);

    // Find many
    try {
        const result: WithId<Document>[] = await collection.find().toArray();

        await connection.close();

        return result
    }
    catch (error: any) {
        await connection.close();
        throw error;
    }
}

/**
 * Truy vấn danh sách nhiều documents khớp với điều kiện được cung cấp từ collection được chỉ định.
 * @param collectionName Tên collection
 * @param filter Điều kiện truy vấn
 * @returns Danh sách các documents khớp với điều kiện
 */
export async function getByFilter(collectionName: string, filter: any): Promise<WithId<Document>[]> {
    // Access collection
    const { connection, collection }: AccessCollectionPath = await accessCollection(collectionName);

    // Find by filter and return
    try {
        const result: WithId<Document>[] = await collection.find(filter).toArray();

        await connection.close();

        return result;
    }
    catch (error: any) {
        await connection.close();
        throw error;
    }
}

/**
 * Thêm mới một đối tượng vào collection được chỉ định.
 * @param collectionName Tên collection
 * @param target Đối tượng lưu
 */
export async function insert(collectionName: string, target: any): Promise<void> {
    // Access collection
    const { connection, collection }: AccessCollectionPath = await accessCollection(collectionName);

    // Insert one
    try {
        await collection.insertOne(target);
        await connection.close();
    }
    catch (error: any) {
        await connection.close();
        throw error;
    }
}

/**
 * Cập nhật một document khớp với điều kiện ở collection được chỉ định bằng một đối tượng bất kỳ.
 * @param collectionName Tên collection
 * @param target Đối tượng sẽ cập nhật cho document
 * @param filter Điều kiện cập nhật
 */
export async function update(collectionName: string, target: any, filter: any): Promise<void> {
    // Access collection
    const { connection, collection }: AccessCollectionPath = await accessCollection(collectionName);

    // Update one
    try {
        await collection.updateOne(filter, {$set: target});
        await connection.close();
    }
    catch (error: any) {
        await connection.close();
        throw error;
    }
}

/**
 * Xóa một document khớp với điều kiện khỏi collection được chỉ định.
 * @param collectionName Tên collection
 * @param filter Điều kiện xóa
 */
export async function remove(collectionName: string, filter: any): Promise<void> {
    // Access collection
    const { connection, collection }: AccessCollectionPath = await accessCollection(collectionName);

    // Delete one
    try {
        await collection.deleteOne(filter);
        await connection.close();
    }
    catch (error: any) {
        await connection.close();
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