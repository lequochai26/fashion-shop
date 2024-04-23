import Order from "../../../domain/entities/upgrade/Order";
import DomainManager from "../../../domain/upgrade/DomainManager";
import AsyncConverter from "../../../utils/interfaces/AsyncConverter";
import OrderInfo from "../../infos/order/OrderInfo";
import QueryOrderRestfulController from "../abstracts/upgrade/QueryOrderRestfulController";
import RestfulControllerParam from "../interfaces/RestfulControllerParam";

export default class GetOrdersByKeyWordController extends QueryOrderRestfulController{
   
    //constructor
    public constructor(
        orderInfoConverter : AsyncConverter<Order,OrderInfo>,
        domainManager?: DomainManager|undefined

    ){
        super(orderInfoConverter,domainManager);
    }
   
    public async execute({request,response}: RestfulControllerParam): Promise<void> {
        //
        const keyword : string | undefined = request.query.keyword as string;

        if(!keyword){
            response.json(
                {
                    success : false,
                    message : "keyword parameter is required!",
                    code : "KEYWORD_REQURIED"
                }
            );
            return;
        }

        const self : GetOrdersByKeyWordController = this;
        try {
            var orders : Order[] = await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.searchOrders(keyword);
                }
            )
        } catch (error) {
            console.error(error);

            response.json(
                {
                    success: false,
                    message: "Failed while handling with DB",
                    code: "HANDLING_DB_FAILED"
                }
            );

            return;
        }

        const result: OrderInfo[] = [];
        for (const order of orders) {
            result.push(await this.orderInfoConverter.convert(order));
        }

        response.json(
            {
                success : true,
                result
            }
        );
    }
    
   
   

}