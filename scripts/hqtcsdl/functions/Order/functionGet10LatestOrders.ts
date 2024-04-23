import Order from "../../collections/Order";

export default async function functionGet10LatestOrders(): Promise<any> {
    const orders: any[] = await Order.select();
    return orders.sort((a,b) => b.date.getTime() - a.date.getTime()).slice(0,10);
}