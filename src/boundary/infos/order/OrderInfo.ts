import OrderInfoItem from "./OrderInfoItem";
import OrderInfoUser from "./OrderInfoUser";

export default interface OrderInfo {
    id: string;
    type: string;
    date: Date;
    totalPrice: number;
    createdBy?: OrderInfoUser;
    orderedBy?: OrderInfoUser;
    items: OrderInfoItem[];
}