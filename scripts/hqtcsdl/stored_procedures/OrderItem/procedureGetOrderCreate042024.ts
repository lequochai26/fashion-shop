import Order from "../../collections/Order";

export default async function procedureGetOrderCreate042024(): Promise<any> {

   const startOfMonth = new Date("2024-04-01T00:00:00.000Z");

   const endOfMonth = new Date("2024-04-30T23:59:59.999Z");

   const orders = await Order.select({ 
       date: { 
           $gte: startOfMonth, 
           $lte: endOfMonth 
       } 
   });
   

   if (orders.length === 0) {
       console.log("Không có đơn hàng nào tồn tại trong tháng 4");
       return [];
   }


   return orders;
}