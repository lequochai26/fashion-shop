import { Document, WithId } from "mongodb";
import Converter from "../../utils/interfaces/Converter";
import CartItemData from "../data/CartItemData";


export default class CartItemDataConverter implements Converter<WithId<Document>,CartItemData> {
    public convert(document: WithId<Document>): CartItemData {
        return {
            itemId: document.itemId,
            email: document.email,
            amount: document.amount,
            metadata: document.metadata
        }
    }
}