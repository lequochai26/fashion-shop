import OrderItemData from "../../persistence/data/OrderItemData";
import ReversableConverter from "../../utils/interfaces/ReversableConverter";
import Item from "../entities/Item";
import Order from "../entities/Order";
import OrderItem from "../entities/OrderItem";

export default class OrderItemConverter implements ReversableConverter<OrderItemData,OrderItem> {
    //Fields:

    //Constructor:
    public constructor() {

    }

    //Methods:
    convert(from: OrderItemData): OrderItem {
        const orderItem : OrderItem = new OrderItem();

        const order = new Order();
        order.Id = from.orderId;
        const item = new Item();
        item.Id = from.itemId;

        orderItem.Order = order;
        orderItem.Item = item;
        orderItem.Amount = from.amount;
        orderItem.Price = from.price;
        orderItem.Metadata = (from.metadata ? JSON.parse(from.metadata) : undefined);

        return orderItem;
    }

    reverse(from: OrderItem): OrderItemData {
        return{
            orderId: from.Order?.Id as string,
            itemId: from.Item?.Id as string,
            amount: from.Amount as number,
            price: from.Price as number,
            metadata: (from.Metadata ? JSON.stringify(from.Metadata) : undefined)
        };
    }
}