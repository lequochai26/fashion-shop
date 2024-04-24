import Order from "../../collections/Order";
import Trigger from "../../types/Trigger";

const triggerInsteadOfUpdateOrder:Trigger = async function (inserted,deleted):Promise<void> {
    //Feild
    //New
    const newType : string = inserted.type;
    const newTotalPrice : number = inserted.totalPrice;
    const newStatus : string = inserted.status;
    const newPaymentMethod : string = inserted.PaymentMethod;
    const newCreatedBy : string = inserted.createdBy;
    const newOrderedBy : string = inserted.orderedBy;

    //Check type
    if(newType !== 'SELL' && newType !== 'BUY'){
        throw new Error('Loại đơn hàng phải là "SELL" hoặc "BUY"!')
    }


    //Check totalPrice
    if(newTotalPrice < 0){
        throw new Error('Tổng tiền đơn hàng phải lớn hơn 0!')
    }


    //Check status
    if(newStatus !== 'APPROVEMENT_AWAITING' && newStatus !== 'DELIVERING' && newStatus !== 'SUCCESS' && newStatus !== 'PAYMENT_AWAITING' && newStatus !== 'CANCELED'){
        throw new Error('Trạng thái đơn hàng không hợp lế!')
    }
    
    
    //Check paymentMethod
    if(newPaymentMethod !== "ETH" && newPaymentMethod !=="VND" && newPaymentMethod !=="ON_RECEIVING"){
        throw new Error('Phương thức thanh toán không hợp lệ!')
    }

    
    //Check createdBy
    if((await Order.select({newCreatedBy})).length === 0){
        throw new Error('email không tồn tại!')
    }
    
    
    //check orderedBy
    if((await Order.select({newOrderedBy})).length === 0){
        throw new Error('email không tồn tại!')
    }
}
export default triggerInsteadOfUpdateOrder;