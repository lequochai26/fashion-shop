import DomainManager from "../../domain/DomainManager";
import Order from "../../domain/entities/Order";
import Converter from "../../utils/interfaces/Converter";
import OrderInfo from "../infos/order/OrderInfo";
import QueryOrderRestfulController from "./abstracts/QueryOrderRestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";

export default class GetOrderController extends QueryOrderRestfulController {
    public constructor(
        orderInfoConverter: Converter<Order, OrderInfo>,
        domainManager?: DomainManager | undefined

    ) {
        super(orderInfoConverter, domainManager)
    }

    //Methods

    public async execute({ response, request }: RestfulControllerParam): Promise<void> {
        //
        const id: string | undefined = request.query.id as string;

        if (!id) {
            response.json(
                {
                    success: false,
                    message: 'id parameter is required!'
                }
            );
            return;
        }


        const path: any[] = []


        try {
            var order: Order | undefined =
                await this.useDomainManager(
                    async function (useDomainManager) {
                        return useDomainManager.getOrder(id, path)
                    }
                )
        } catch (error: any) {
            console.log(error);
            response.json(
                {
                    success: false,
                    message: "Failed while handling with DB!"
                }
            )
            return;
        }
        response.json(
            {
                success: true,
                result: order && this.orderInfoConverter.convert(order)
            }
        )
    }
}