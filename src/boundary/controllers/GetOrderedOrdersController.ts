import DomainManager from "../../domain/DomainManager";
import Order from "../../domain/entities/Order";
import Converter from "../../utils/interfaces/Converter";
import RestfulError from "../errors/RestfulError";
import OrderInfo from "../infos/order/OrderInfo";
import QueryOrderRestfulController from "./abstracts/QueryOrderRestfulController";

import RestfulControllerParam from "./interfaces/RestfulControllerParam";

export default class GetOrderedOrdersController extends QueryOrderRestfulController{
    //Constructors:
    public constructor(
        orderInfoConverter: Converter<Order, OrderInfo>,
        domainManager?: DomainManager | undefined,
    ) {
        super(orderInfoConverter,domainManager);
    }

    //Method:
    public async execute({ request, response }: RestfulControllerParam): Promise<void> {
        //Path initialazation
        const path: any[] = [];

        //Validate
        try {
            var { user } = await this.loginValidateController.execute({ request, path });
        } catch (error: any) {
            if (error instanceof RestfulError){
                response.json(
                    {
                        success: false,
                        message: error.message,
                        code: error.Code
                    }
                );

                return;
            } else {
                response.json(
                    {
                        success: false,
                        message: "Failed while handling with DB!",
                        code: "HANDLING_DB_FAILED"
                    }
                );

                return;
            }
        }

        //Responseding
        response.json(
            {
                success: true,
                result: user.OrderedOrders.map(
                    (order: Order): OrderInfo => {
                        return this.orderInfoConverter.convert(order);
                    }
                ).sort(
                    (a, b) => b.date.getTime() - a.date.getTime()
                )
            }
        );
    }
}