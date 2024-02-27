import OrderData from "../../persistence/data/OrderData";
import ReversableConverter from "../../utils/interfaces/ReversableConverter";
import Order from "../entities/Order";
import User from "../entities/User";


export default class OrderConverter implements ReversableConverter<OrderData,Order>{
    convert(from: OrderData): Order {
        const order = new Order();

        order.Id = from.id;
        order.Type = from.type;
        order.Date = from.date;
        order.TotalPrice = from.totalPrice;
        order.MetaData = from.metadata;

        return order;
    }
    reverse(from: Order): OrderData {
        return{
            id: from.Id as string,
            type: from.Type as string,
            date: from.Date as Date,
            totalPrice: from.TotalPrice as number,
            metadata: from.MetaData as string,
            createdBy: from.CreatedBy?.Email as string,
            orderedBy: from.OrderedBy?.Email as string,
        }
    }
    
}