import Order from "../../collections/Order";
import Trigger from "../../types/Trigger";

const triggerInsteadOfDeleteOrder:Trigger = async function (inserted,deleted) {

    //Kiểm tra đơn hàng đã được lập không quá 2 năm
    const orders = await Order.select({ id: deleted.id })

    for(const order of orders){
        const orderDate: Date = new Date(order.date);
        const now: Date = new Date();

        if(now.getTime() - orderDate.getTime() < 31536000000*2){
            throw new Error("Không thể xóa đơn hàng được tạo chưa đến 2 năm!")
        }
    }
}
export default triggerInsteadOfDeleteOrder;
    
