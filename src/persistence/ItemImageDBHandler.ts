import DBHandler from "./DBHandler";
import { Document, WithId } from "mongodb";
import ItemImageData from "./data/ItemImageData";
import ItemImagePrimaryKey from "./pkeys/ItemImagePrimaryKey";
import { get, getAll, getByFilter, insert, remove, update } from "./Connector";
import Converter from "../utils/interfaces/Converter";

export default class ItemImageDBHandler implements DBHandler<ItemImageData,ItemImagePrimaryKey>{
 //fields:
 private itemImageDataConverter: Converter<WithId<Document>, ItemImageData>;

 //constructor:
 public constructor(itemImageDataConverter: Converter<WithId<Document>, ItemImageData>) {
     this.itemImageDataConverter = itemImageDataConverter;
 }
 async get(pKey: ItemImagePrimaryKey): Promise<ItemImageData | undefined> {
    //Methods:
    const document: WithId<Document> | null = await get("CartItem", pKey);

    if (!document) {
        return;
    }
    return this.itemImageDataConverter.convert(document);
}



    //getAll
    async getAll(): Promise<ItemImageData[]> {
        const documents: WithId<Document>[] = await getAll("ItemImage")

        const itemImageDataList: ItemImageData[] = [];

        for (const document of documents) {
            itemImageDataList.push(
                this.itemImageDataConverter.convert(document)
            );
        }
        return itemImageDataList;
    }

    
    async getByFilter(filter: any): Promise<ItemImageData[]> {
        const documents: WithId<Document>[] = await getByFilter("ItemImage", filter)

        const itemImageDataList: ItemImageData[] = [];

        for (const document of documents) {
            itemImageDataList.push(
                this.itemImageDataConverter.convert(document)
            );
        }
        return itemImageDataList;
    }

   async insert(target: ItemImageData): Promise<void> {
     await insert("ItemImage", target)
    }
   async update(target: ItemImageData): Promise<void> {
        const pKey: ItemImagePrimaryKey = {
            path: target.path,
            itemId: target.itemId,
        }
    }
   async remove(target: ItemImageData): Promise<void> {
        const pKey: ItemImagePrimaryKey = {
            path: target.path,
            itemId: target.itemId,
        }
        await this.removeByPrimaryKey(pKey);
    }
    async removeByPrimaryKey(pKey: ItemImagePrimaryKey): Promise<void> {
        await remove ("ItemImage", pKey)
    }
    
}