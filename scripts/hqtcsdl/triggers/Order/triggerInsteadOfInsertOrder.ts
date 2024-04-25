import Brand from "../../collections/Brand";
import Order from "../../collections/Order";
import User from "../../collections/User";
import Trigger from "../../types/Trigger";

const triggerInsteadOfInsertOrder:Trigger = async function (inserted,deleted):Promise <void> {
    //feilds
    const id: string = inserted.id;
    const type: string = inserted.type;
    const totalPrice: number = inserted.totalPrice;
    const status: string = inserted.status;
    const paymentMethod: string = inserted.paymentMethod;
    const createdBy: string | undefined = inserted.orderedBy;
    const orderedBy: string | undefined = inserted.createdBy;

    //id check
    if(!id){
        throw new Error('Mã đơn hàng không được rỗng!')
    }
    if((await Order.select({id})).length > 0){
        throw new Error(`mã ${id} thuộc về đơn hàng khác!`)
    }


    //type check
    if(type !== 'SELL' && type !=='BUY'){
        throw new Error('Loại đơn hàng phải là "SELL" hoặc "BUY"!')
    }

    //totalPrice check
    if(!totalPrice){
        throw new Error('Chưa cung cấp tổng tiền đơn hàng!')
    }
    if(totalPrice < 0){
        throw new Error('Tổng tiền đơn hàng phải lớn hơn 0!')
    }

    //status check
    if(status !== 'APPROVEMENT_AWAITING' && status !== 'DELIVERING' && status !== 'SUCCESS' && status !== 'PAYMENT_AWAITING' && status !== 'CANCELED'){
        throw new Error('Trạng thái đơn hàng không chính xác!')
    }

    //check paymentMethod
    if(paymentMethod !== "ETH" && paymentMethod !=="VND" && paymentMethod !=="ON_RECEIVING"){
        throw new Error('Phương thức thanh toán không chính xác!')
    }

    //check createdBy
    if(createdBy){
        if((await User.select({email: createdBy})).length === 0){
            throw new Error('email không tồn tại!')
        }
    }
    
    //check orderedBy
    if(orderedBy){
        if((await User.select({email: orderedBy})).length === 0){
            throw new Error('email không tồn tại!')
        }
    }
}

export default triggerInsteadOfInsertOrder;