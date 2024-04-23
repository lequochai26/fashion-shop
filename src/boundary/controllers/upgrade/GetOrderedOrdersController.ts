import Order from "../../../domain/entities/upgrade/Order";
import DomainManager from "../../../domain/upgrade/DomainManager";
import AsyncConverter from "../../../utils/interfaces/AsyncConverter";
import RestfulError from "../../errors/RestfulError";
import OrderInfo from "../../infos/order/OrderInfo";
import QueryOrderRestfulController from "../abstracts/upgrade/QueryOrderRestfulController";
import RestfulControllerParam from "../interfaces/RestfulControllerParam";

export default class GetOrderedOrdersController extends QueryOrderRestfulController{
    //Constructors:
    public constructor(
        orderInfoConverter: AsyncConverter<Order, OrderInfo>,
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

        const result: OrderInfo[] = [];
        for (const order of (await user.getOrderedOrders())) {
            result.push(await this.orderInfoConverter.convert(order));
        }

        //Responseding
        response.json(
            {
                success: true,
                result: result.sort(
                    (a, b) => b.date.getTime() - a.date.getTime()
                )
            }
        );
    }
}