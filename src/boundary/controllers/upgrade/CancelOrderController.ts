import Order from "../../../domain/entities/upgrade/Order";
import User from "../../../domain/entities/upgrade/User";
import OrderStatus from "../../../domain/enums/OrderStatus";
import DomainManager from "../../../domain/upgrade/DomainManager";
import RestfulError from "../../errors/RestfulError";
import PermissionRequiredRestfulController from "../abstracts/upgrade/PermissionRequiredRestfulController";
import RestfulControllerParam from "../interfaces/RestfulControllerParam";

export default class CancelOrderController extends PermissionRequiredRestfulController {
    // Constructors:
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);
    }

    // Methods:
    public async execute({ request, response }: RestfulControllerParam): Promise<void> {
        // Pre-condition check
        const path: any[] = [];

        let user: User;

        try {
            const loginValidatePath = await this.loginValidateController.execute({request, path});

            user = loginValidatePath.user;
        }
        catch (error: any) {
            if (error instanceof RestfulError) {
                response.json({
                    success: false,
                    message: error.message,
                    code: error.Code
                });
            }
            else {
                response.json({
                    success: false,
                    message: "Failed while handling with DB!",
                    code: "HANDLING_DB_FAILED"
                });
            }

            return;
        }
        
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

        // Get order from user
        const order: Order | undefined = await user.getOrderedOrder(id);

        // Check order's exist
        if (!order) {
            response.json({
                success: false,
                message: "Order not exist!",
                code: "ORDER_NOT_EXIST"
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