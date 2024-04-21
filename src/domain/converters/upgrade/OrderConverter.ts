import OrderData from "../../../persistence/data/OrderData";
import AsyncReversableConverter from "../../../utils/interfaces/AsyncReversableConverter";
import Order from "../../entities/upgrade/Order";
import User from "../../entities/upgrade/User";

export default class OrderConverter implements AsyncReversableConverter<OrderData,Order>{
    public async convert(from: OrderData): Promise<Order> {
        const order = new Order();

        order.Id = from.id;
        order.Type = from.type;
        order.Date = from.date;
        order.TotalPrice = from.totalPrice;
        order.Metadata = from.metadata;
        order.Status = from.status;

        if (from.createdBy) {
            const createdBy: User = new User();
            (createdBy as any).fromConverter = true;
            createdBy.Email = from.createdBy;
            order.CreatedBy = createdBy;
        }

        if (from.orderedBy) {
            const orderedBy: User = new User();
            (orderedBy as any).fromConverter = true;
            orderedBy.Email = from.orderedBy;
            order.OrderedBy = orderedBy;
        }

        order.PaymentMethod = from.paymentMethod;

        return order;
    }
    public async reverse(from: Order): Promise<OrderData> {
        return {
            id: from.Id as string,
            type: from.Type as string,
            date: from.Date as Date,
            totalPrice: from.TotalPrice as number,
            metadata: from.Metadata as string,
            createdBy: (await from.getCreatedBy())?.Email,
            orderedBy: (await from.getOrderedBy())?.Email,
            status: from.Status as string,
            paymentMethod: from.PaymentMethod as string
        };
    }
    
}