import { Document, WithId } from "mongodb";
import DBHandler from "./DBHandler";
import CartItemData from "./data/CartItemData";
import { get, getAll, getByFilter, insert, remove, update } from "./Connector";
import Converter from "../utils/interfaces/Converter";
import CartItemPrimaryKey from "./pkeys/CartItemPrimaryKey";


export default class CartItemDBHandler implements DBHandler<CartItemData, CartItemPrimaryKey>{


    //Static fields
    private static collectionName: string = "CartItem"

    //fields:
    private cartItemDataConverter: Converter<WithId<Document>, CartItemData>;

    //constructor:
    public constructor(cartItemDataConverter: Converter<WithId<Document>, CartItemData>) {
        this.cartItemDataConverter = cartItemDataConverter;
    }

    //Methods:
    public async get(pKey: CartItemPrimaryKey): Promise<CartItemData | undefined> {
        
        const document: WithId<Document> | null = await get(
            CartItemDBHandler.collectionName,
             pKey
             );

        if (!document) {
            return;
        }
        return this.cartItemDataConverter.convert(document);
    }

    //getAll
    public async getAll(): Promise<CartItemData[]> {
        const documents: WithId<Document>[] = await getAll(CartItemDBHandler.collectionName)

        const cartItemDataList: CartItemData[] = [];

        for (const document of documents) {
            cartItemDataList.push(
                this.cartItemDataConverter.convert(document)
            );
        }
        return cartItemDataList;
    }


    //getByFilter
    public async getByFilter(filter: any): Promise<CartItemData[]> {
        const documents: WithId<Document>[] = await getByFilter(CartItemDBHandler.collectionName, filter)

        const cartItemDataList: CartItemData[] = [];

        for (const document of documents) {
            cartItemDataList.push(
                this.cartItemDataConverter.convert(document)
            );
        }
        return cartItemDataList;
    }

    //insert
    public async insert(target: CartItemData): Promise<void> {
        await insert(CartItemDBHandler.collectionName, target)
    }

    //update
    public async update(target: CartItemData): Promise<void> {
        const pKey: CartItemPrimaryKey = {
            itemId: target.itemId,
            email: target.email,
            metadata: target.metadata,
        }
        await update(CartItemDBHandler.collectionName, target, pKey)
    }

    //remove 
    public async remove(target: CartItemData): Promise<void> {
        const pKey: CartItemPrimaryKey = {
            itemId: target.itemId,
            email: target.email,
            metadata: target.metadata,
        }
        await this.removeByPrimaryKey(pKey);
    }

    async removeByPrimaryKey(pKey: CartItemPrimaryKey): Promise<void> {
        await remove(CartItemDBHandler.collectionName, pKey)
    }
}
