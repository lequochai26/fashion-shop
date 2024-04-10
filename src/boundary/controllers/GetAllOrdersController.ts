import { response } from "express";
import DomainManager from "../../domain/DomainManager";
import Order from "../../domain/entities/Order";
import Converter from "../../utils/interfaces/Converter";
import OrderInfo from "../infos/order/OrderInfo";
import QueryOrderRestfulController from "./abstracts/QueryOrderRestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";

export default class GetAllOrdersController extends QueryOrderRestfulController{
    //constructor
    public constructor(
        orderInfoConverter: Converter<Order,OrderInfo>,
        domainManager?: DomainManager | undefined
    ){
        super(orderInfoConverter,domainManager)
    }
    
    public async execute({response}: RestfulControllerParam): Promise<void> {
        const self : GetAllOrdersController = this;

        //path
        const path: any[] = [];

        //get all orders
        try{
            var orders: Order[] = await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.getAllOrders(path);
                }
            );
        }catch(error: any){
            console.error(error);
            response.json({
                success: false,
                message:"Failed while handling with DB!",
                code:"HANDLING_DB_FAILED"
            });
            return;
        }
        
        //response client
        response.json({
            success: true,
            result: orders.map(
                function(order: Order): OrderInfo{
                    return self.orderInfoConverter.convert(order);
                }
            )
        });

    }
    
}