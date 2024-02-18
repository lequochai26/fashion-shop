import { Document, WithId } from "mongodb";
import DBHandler from "./DBHandler";
import CartItemData from "./data/CartItemData";
import { get, getAll, getByFilter, insert, remove, update } from "./Connector";
import Converter from "../utils/interfaces/Converter";
import CartItemPrimaryKey from "./pkeys/CartItemPrimaryKey";


export default class CartItemDBHandler implements DBHandler<CartItemData, CartItemPrimaryKey>{
    //fields:
    private cartItemDataConverter: Converter<WithId<Document>, CartItemData>;

    //constructor:
    public constructor(cartItemDataConverter: Converter<WithId<Document>, CartItemData>) {
        this.cartItemDataConverter = cartItemDataConverter;
    }
    async get(pKey: CartItemPrimaryKey): Promise<CartItemData | undefined> {
        //Methods:
        const document: WithId<Document> | null = await get("CartItem", pKey);

        if (!document) {
            return;
        }
        return this.cartItemDataConverter.convert(document);
    }

    //getAll
    async getAll(): Promise<CartItemData[]> {
        const documents: WithId<Document>[] = await getAll("CartItem")

        const cartItemDataList: CartItemData[] = [];

        for (const document of documents) {
            cartItemDataList.push(
                this.cartItemDataConverter.convert(document)
            );
        }
        return cartItemDataList;
    }


    //getByFilter
    async getByFilter(filter: any): Promise<CartItemData[]> {
        const documents: WithId<Document>[] = await getByFilter("CartItem", filter)

        const cartItemDataList: CartItemData[] = [];

        for (const document of documents) {
            cartItemDataList.push(
                this.cartItemDataConverter.convert(document)
            );
        }
        return cartItemDataList;
    }

    //insert
    async insert(target: CartItemData): Promise<void> {
        await insert("CartItem", target)
    }

    //update
    async update(target: CartItemData): Promise<void> {
        const pKey: CartItemPrimaryKey = {
            itemId: target.itemId,
            email: target.email,
            metadata: target.metadata,
        }
        await update("CartItem", target, pKey)
    }

    //remove 
    async remove(target: CartItemData): Promise<void> {
        const pKey: CartItemPrimaryKey = {
            itemId: target.itemId,
            email: target.email,
            metadata: target.metadata,
        }
        await this.removeByPrimaryKey(pKey);
    }

    async removeByPrimaryKey(pKey: CartItemPrimaryKey): Promise<void> {
        await remove("CartItem", pKey)
    }
}
