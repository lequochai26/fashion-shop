import { Document, WithId } from "mongodb";
import { get, getAll, getByFilter, insert, remove, update } from "./Connector";
import DBHandler from "./DBHandler";
import VerificationCodeData from "./data/VerificationCodeData";
import VerificationCodePrimaryKey from "./pkeys/VerificationCodePrimaryKey";
import VerificationCodeDataConverter from "./converters/VerificationCodeDataConverter";

export default class VerificationCodeDBHandler implements DBHandler<VerificationCodeData, VerificationCodePrimaryKey> {
    // Static fields:
    private static collectionName: string = "VerificationCode"

    // Fields:
    private converter: VerificationCodeDataConverter;

    // Constructor:
    public constructor(converter: VerificationCodeDataConverter) {
        this.converter = converter;
    }

    // Methods:
    public async get(pKey: VerificationCodePrimaryKey): Promise<VerificationCodeData | undefined> {
        // Get first document matches pKey (as filter) in db.
        const document: WithId<Document> | null = await get(
            VerificationCodeDBHandler.collectionName,
            pKey
        );

        // No document matches pKey case.
        if (!document) {
            // Return undefined
            return;
        }

        // Found a document matches to pKey (as filter).
        // Convert document to VerificationCodeData DTO
        const verificationCodeData: VerificationCodeData = this
        .converter
        .convert(document);

        // Return verificationCodeData
        return verificationCodeData;
    }

    public async getAll(): Promise<VerificationCodeData[]> {
        // Get all documents from specific collection in db.
        const documents: WithId<Document>[] = await getAll(
            VerificationCodeDBHandler.collectionName
        );

        // VerificationCodeData DTOs initialization (as a result collection)
        const result: VerificationCodeData[] = [];

        // Converting documents to VerificationCodeData DTOs and add into result.
        for (const document of documents) {
            // Converting document to VerificationCode DTOs
            const verificationCodeData: VerificationCodeData = this
            .converter
            .convert(document);

            // Add converted verificationCodeData DTO into result
            result.push(verificationCodeData);
        }

        // Return result
        return result;
    }

    public async getByFilter(filter: any): Promise<VerificationCodeData[]> {
        // Get all documents that matches to filter in the specific collection in db.
        const documents: WithId<Document>[] = await getByFilter(
            VerificationCodeDBHandler.collectionName,
            filter
        );

        // VerificationCodeData DTOs list initialization (as result).
        const result: VerificationCodeData[] = [];

        // Converting all documents to VerificationCodeData DTOs and add into result.
        for (const document of documents) {
            // Converting document into VerificationCodeData DTO
            const verificationCodeData: VerificationCodeData = this
            .converter
            .convert(document);

            // Add converted verificationCodeData into result
            result.push(verificationCodeData);
        }

        // Return result
        return result;
    }

    public async insert(target: VerificationCodeData): Promise<void> {
        // Inserting and exit after inserted successfully.
        return insert(
            VerificationCodeDBHandler.collectionName,
            target
        );
    }

    public async update(target: VerificationCodeData): Promise<void> {
        // Create a primary key object for target (use it as filter for updating document)
        // Explain: We need a filter for updating documents in No-SQL DB. It's similar to 'WHERE' clause in SQL.
        const pKey: VerificationCodePrimaryKey = {
            email: target.email,
            code: target.code
        };

        // Updating and exit after updated successfully.
        return update(
            VerificationCodeDBHandler.collectionName,
            target,
            pKey
        );
    }

    public async remove(target: VerificationCodeData): Promise<void> {
        // Create a primary key object for target (use it as filter for removing document)
        // Explain: We need a filter for updating documents in No-SQL DB. It's similar to 'WHERE' clause in SQL.
        const pKey: VerificationCodePrimaryKey = {
            email: target.email,
            code: target.code
        };

        // Updating and exit after updated successfully.
        return this.removeByPrimaryKey(pKey);
    }

    public async removeByPrimaryKey(pKey: VerificationCodePrimaryKey): Promise<void> {
        // Removing document that match pKey as filter and exit after removed successfully.
        return remove(
            VerificationCodeDBHandler.collectionName,
            pKey
        );
    }
}