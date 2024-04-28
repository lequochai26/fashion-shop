import OrderInfoItemItem from "./OrderInfoItemItem";

export default interface OrderInfoItem {
    item: OrderInfoItemItem;
    amount: number;
    price: number;
    metadata?: any;
}