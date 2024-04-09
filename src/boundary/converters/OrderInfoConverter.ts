import Order from "../../domain/entities/Order";
import Converter from "../../utils/interfaces/Converter";
import OrderInfo from "../infos/order/OrderInfo";

export default class OrderInfoConverter implements Converter<Order, OrderInfo> {
    // Constructors:
    public constructor() {

    }

    // Methods:
    public convert(from: Order): OrderInfo {
        return {
            id: from.Id as string,
            type: from.Type as string,
            createdBy: from.CreatedBy && {
                email: from.CreatedBy.Email as string,
                fullName: from.CreatedBy.FullName as string
            },
            orderedBy: from.OrderedBy && {
                email: from.OrderedBy.Email as string,
                fullName: from.OrderedBy.FullName as string
            },
            date: from.Date as Date,
            items: from.Items.map(
                item => ({
                    id: item.Item?.Id as string,
                    amount: item.Amount as number,
                    name: item.Item?.Name as string,
                    price: item.Item?.Price as number,
                    metadata: item.Item?.Metadata
                })
            ),
            totalPrice: from.TotalPrice as number,
            status: from.Status as string
        };
    }
}