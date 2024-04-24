import OrderItem from "../../collections/OrderItem";

export default async function procedureGetAllOrderItems():Promise<any> {
    return OrderItem.select()
}