import DomainManager from "../../domain/DomainManager";
import Order from "../../domain/entities/Order";
import Converter from "../../utils/interfaces/Converter";
import OrderInfo from "../infos/order/OrderInfo";
import QueryOrderRestfulController from "./abstracts/QueryOrderRestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";

export default class GetOrdersByKeyWordController extends QueryOrderRestfulController{
   
    //constructor
    public constructor(
        orderInfoConverter : Converter<Order,OrderInfo>,
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
            var order : Order[] = await this.useDomainManager(
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

        response.json(
            {
                success : true,
                result : order.map(
                    function(order: Order):OrderInfo{
                        return self.orderInfoConverter.convert(order);
                    }
                )
            }
        );
    }
    
   
   

}