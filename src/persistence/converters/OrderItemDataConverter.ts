import { Document, WithId } from "mongodb";
import Converter from "../../utils/interfaces/Converter";
import OrderItemData from "../data/OrderItemData";

export default class OrderItemDataConverter implements Converter<WithId<Document>, OrderItemData>{
    public convert(from: WithId<Document>): OrderItemData {
        return{
            orderId: from.orderId,
            itemId: from.itemId,
            amount: from.amount,
            price: from.price,
            metadata: from.metadata
        }
    }
}