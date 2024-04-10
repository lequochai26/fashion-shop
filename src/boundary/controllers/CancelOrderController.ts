import DomainManager from "../../domain/DomainManager";
import Order from "../../domain/entities/Order";
import OrderStatus from "../../domain/enums/OrderStatus";
import OrderType from "../../domain/enums/OrderType";
import RestfulController from "./abstracts/RestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";

export default class CancelOrderController extends RestfulController {
    // Constructors:
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);
    }

    // Methods:
    public async execute({ request, response }: RestfulControllerParam): Promise<void> {
        // Get id
        const id: string | undefined = request.query.id as string | undefined;

        // ID undefined case
        if (!id) {
            response.json({
                success: false,
                message: "id parameter is required!",
                code: "ID_REQUIRED"
            });
            return;
        }

        // Path intialize
        const path: any[] = [];

        // Get order
        const order: Order | undefined = await this.useDomainManager(
            async domainManager => domainManager.getOrder(id, path)
        );

        // Check order's exist
        if (!order) {
            response.json({
                success: false,
                message: "Order not exist!",
                code: "ORDER_NOT_EXIST"
            });
            return;
        }

        // Check order's type
        if ((order.Type as string) !== OrderType.SELL) {
            response.json({
                success: false,
                message: "Cannot cancel a buy order!",
                code: "CANNOT_CANCEL_BUY_ORDER"
            });
            return;
        }

        // Check order's status
        if ((order.Status as string) !== OrderStatus.APPROVEMENT_AWAITING) {
            response.json({
                success: false,
                message: "Can only cancel an awaiting for approvement order!",
                code: "AWAITING_APPROVEMENT_ORDER_ONLY"
            });
            return;
        }

        // Cancel order
        await this.useDomainManager(
            async domainManager => domainManager.cancelOrder(order)
        );

        // Response
        response.json({ success: true });
    }
}