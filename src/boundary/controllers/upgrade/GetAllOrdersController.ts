import Order from "../../../domain/entities/upgrade/Order";
import DomainManager from "../../../domain/upgrade/DomainManager";
import AsyncConverter from "../../../utils/interfaces/AsyncConverter";
import RestfulError from "../../errors/RestfulError";
import OrderInfo from "../../infos/order/OrderInfo";
import QueryOrderRestfulController from "../abstracts/upgrade/QueryOrderRestfulController";
import RestfulControllerParam from "../interfaces/RestfulControllerParam";

export default class GetAllOrdersController extends QueryOrderRestfulController{
    //constructor
    public constructor(
        orderInfoConverter: AsyncConverter<Order,OrderInfo>,
        domainManager?: DomainManager | undefined
    ){
        super(orderInfoConverter,domainManager)
    }
    
    public async execute({response, request}: RestfulControllerParam): Promise<void> {
        const self : GetAllOrdersController = this;

        //path
        const path: any[] = [];
        
        //validate
        try{
            await this.employeeValidateController.execute({request, path});
        }catch(error: any){
            if(error instanceof RestfulError)
                response.json({
                    success: false,
                    message: error.message,
                    code: error.Code
                });
            
            else{
                response.json({
                    success: false,
                    message: "Failed while handling with DB",
                    code: "HANDLING_DB_FAILED"
                });
            }

            return;
        }
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

        const result: OrderInfo[] = [];
        for (const order of orders) {
            result.push(await this.orderInfoConverter.convert(order));
        }
        
        //response client
        response.json({
            success: true,
            result
        });

    }
    
}