import Order from "../../../domain/entities/upgrade/Order";
import AsyncConverter from "../../../utils/interfaces/AsyncConverter";
import OrderInfo from "../../infos/order/OrderInfo";
import OrderInfoItem from "../../infos/order/OrderInfoItem";

export default class OrderInfoConverter implements AsyncConverter<Order, OrderInfo> {
    // Constructors:
    public constructor() {

    }

    // Methods:
    public async convert(from: Order): Promise<OrderInfo> {
        const items: OrderInfoItem[] = [];
        for (const item of await from.getItems()) {
            items.push(
                {
                    item: {
                        id: item.Item?.Id as string,
                        name: item.Item?.Name as string,
                        avatar: item.Item?.Avatar as string,
                        metadata: item.Item?.Metadata
                    },
                    amount: item.Amount as number,
                    price: item.Price as number,
                    metadata: item.Metadata
                }
            );
        }

        return {
            id: from.Id as string,
            type: from.Type as string,
            createdBy: (await from.getCreatedBy()) && {
                email: (await from.getCreatedBy())?.Email as string,
                fullName: (await from.getCreatedBy())?.FullName as string
            },
            orderedBy: (await from.getOrderedBy()) && {
                email: (await from.getOrderedBy())?.Email as string,
                fullName: (await from.getOrderedBy())?.FullName as string
            },
            date: from.Date as Date,
            items,
            totalPrice: from.TotalPrice as number,
            status: from.Status as string,
            paymentMethod: from.PaymentMethod as string
        };
    }
}