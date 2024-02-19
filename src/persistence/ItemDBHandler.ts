import DBHandler from "./DBHandler";
import { Document, WithId } from "mongodb";
import ItemData from "./data/ItemData";
import ItemPrimaryKey from "./pkeys/ItemPrimaryKey";
import { get, getAll, getByFilter, insert, remove, update } from "./Connector";
import Converter from "../utils/interfaces/Converter";

export default class ItemDBHandler implements DBHandler<ItemData,ItemPrimaryKey>{
    //fields:
    private itemDataConverter: Converter<WithId<Document>, ItemData>;
    
    //constructor:
    public constructor(itemDataConverter: Converter<WithId<Document>, ItemData>) {
        this.itemDataConverter = itemDataConverter;
    }
    async get(pKey: ItemPrimaryKey): Promise<ItemData | undefined> {
    
    //Methods:
    const document: WithId<Document> | null = await get("Item", pKey);

        if (!document) {
            return;
        }
        return this.itemDataConverter.convert(document);
    }


    //getAll
    async getAll(): Promise<ItemData[]> {
        const documents: WithId<Document>[] = await getAll("Item")
        const itemDataList: ItemData[] = [];

        for (const document of documents) {
            itemDataList.push(
                this.itemDataConverter.convert(document)
            );
        }
        return itemDataList;
    }

    //getByFilter
    async getByFilter(filter: any): Promise<ItemData[]> {
        const documents: WithId<Document>[] = await getByFilter("Item", filter)

        const itemDataList: ItemData[] = [];

        for (const document of documents) {
            itemDataList.push(
                this.itemDataConverter.convert(document)
            );
        }
        return itemDataList;
    }

    //insert
   async insert(target: ItemData): Promise<void> {
     await insert("Item", target)
    }

    //update
   async update(target: ItemData): Promise<void> {
        const pKey: ItemPrimaryKey = {
            id: target.id,
        }
    }

    //remove
   async remove(target: ItemData): Promise<void> {
        const pKey: ItemPrimaryKey = {
            id: target.id,
        }
        await this.removeByPrimaryKey(pKey);
    }
    
    //removeByPrimaryKey
    async removeByPrimaryKey(pKey: ItemPrimaryKey): Promise<void> {
        await remove ("Item", pKey)
    }
    
}