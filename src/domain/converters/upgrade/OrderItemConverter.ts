import OrderItemData from "../../../persistence/data/OrderItemData";
import AsyncReversableConverter from "../../../utils/interfaces/AsyncReversableConverter";
import Item from "../../entities/upgrade/Item";
import Order from "../../entities/upgrade/Order";
import OrderItem from "../../entities/upgrade/OrderItem";

export default class OrderItemConverter implements AsyncReversableConverter<OrderItemData,OrderItem> {
    //Fields:

    //Constructor:
    public constructor() {

    }

    //Methods:
    public async convert(from: OrderItemData): Promise<OrderItem> {
        const orderItem : OrderItem = new OrderItem();

        const order = new Order();
        (order as any).fromConverter = true;
        order.Id = from.orderId;
        const item = new Item();
        (item as any).fromConverter = true;
        item.Id = from.itemId;

        orderItem.Order = order;
        orderItem.Item = item;
        orderItem.Amount = from.amount;
        orderItem.Price = from.price;
        orderItem.Metadata = (from.metadata ? JSON.parse(from.metadata) : undefined);

        return orderItem;
    }

    public async reverse(from: OrderItem): Promise<OrderItemData> {
        return{
            orderId: (await from.getOrder())?.Id as string,
            itemId: (await from.getItem())?.Id as string,
            amount: from.Amount as number,
            price: from.Price as number,
            metadata: (from.Metadata ? JSON.stringify(from.Metadata) : undefined)
        };
    }
}