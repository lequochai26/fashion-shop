import { WithId,Document} from "mongodb";
import OrderData from "../data/OrderData";
import Converter from "../../utils/interfaces/Converter";

export default class OrderDataConverter implements Converter<WithId<Document>,OrderData>{
    public constructor(){}

    public convert(document: WithId<Document>): OrderData {
        return {
            id: document.id, 
            type: document.type,  
            date: document.date, 
            totalPrice: document.totalPrice,
            metadata: document.metadata,
            createdBy: document.createdBy,
            orderedBy: document.orderedBy,
            status: document.status,
            paymentMethod: document.paymentMethod
        };
    }
}