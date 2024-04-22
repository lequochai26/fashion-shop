import Order from "../../collections/Order";

export default async function viewOrderTotalPriceDesc(): Promise<any[]> {
    // Select orders
    let orders: any[] = await Order.select();

    // Desc sorting
    orders = orders.sort(
        (a, b) => b.totalPrice - a.totalPrice
    );

    // Return orders
    return orders;
}