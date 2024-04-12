import DomainManager from "../../domain/DomainManager";
import OrderStatus from "../../domain/enums/OrderStatus";
import OrderType from "../../domain/enums/OrderType";
import RestfulError from "../errors/RestfulError";
import NewOrderRestfulController from "./abstracts/NewOrderRestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";
import { LoginValidatePath } from "./LoginValidateController";

export default class CreateOrderController extends NewOrderRestfulController {
    // Constructors:
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);
    }

    // Methods:
    public async execute({ request, response }: RestfulControllerParam): Promise<void> {
        // Path intialize
        const path: any[] = [];

        // Pre-condition check
        try {
            var { user }: LoginValidatePath = await this.loginValidateController.execute({ request, path });
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
                console.error(error);
                response.json({
                    success: false,
                    message: "Failed while handling with DB!",
                    code: "HANDLING_DB_FAILED"
                });
            }

            return;
        }

        // Validate new order info
        try {
            var { items, type, paymentMethod } = await this.validateController.execute({
                items: request.body.items,
                path: path,
                paymentMethod: request.body.paymentMethod,
                type: OrderType.SELL
            });
        }
        catch (error: any) {
            if (error instanceof RestfulError) {
                response.json({
                    success: false,
                    message: error.message,
                    code: error.code
                });
            }
            else {
                console.error(error);
                response.json({
                    success: false,
                    message: "Failed while handling with DB!",
                    code: "HANDLING_DB_FAILED"
                });
            }
            return;
        }

        // Order creating
        try {
            await this.useDomainManager(
                async domainManager => domainManager.newOrder(
                    {
                        items, path, type, paymentMethod,
                        orderedBy: user.Email as string,
                        status: OrderStatus.APPROVEMENT_AWAITING
                    }
                )
            );
        }
        catch (error: any) {
            response.json({
                success: false,
                message: "Failed while handling with DB!",
                code: "HANDLING_DB_FAILED"
            });
            return;
        }

        // Response
        response.json({
            success: true
        });
    }
}