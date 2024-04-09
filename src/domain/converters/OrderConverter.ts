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
        order.Metadata = from.metadata;
        order.Status = from.status;

        if (from.createdBy) {
            const createdBy: User = new User();
            createdBy.Email = from.createdBy;
            order.CreatedBy = createdBy;
        }

        if (from.orderedBy) {
            const orderedBy: User = new User();
            orderedBy.Email = from.orderedBy;
            order.OrderedBy = orderedBy;
        }

        return order;
    }
    reverse(from: Order): OrderData {
        return {
            id: from.Id as string,
            type: from.Type as string,
            date: from.Date as Date,
            totalPrice: from.TotalPrice as number,
            metadata: from.Metadata as string,
            createdBy: from.CreatedBy?.Email,
            orderedBy: from.OrderedBy?.Email,
            status: from.Status as string
        };
    }
    
}