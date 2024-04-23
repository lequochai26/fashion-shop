import DomainManager from "../../../domain/upgrade/DomainManager";
import RestfulError from "../../errors/RestfulError";
import NewOrderRestfulController from "../abstracts/upgrade/NewOrderRestfulController";
import RestfulControllerParam from "../interfaces/RestfulControllerParam";
import { NewOrderValidateControllerReturn } from "./NewOrderValidateController";

export default class OptimizedNewOrderController extends NewOrderRestfulController {
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

        try {
            var { user } = await this.employeeValidateController.execute({ request, path });
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

        // Validate new order informations
        try {
            var { items, paymentMethod, type, totalPrice }: NewOrderValidateControllerReturn = await this.validateController.execute({
                items: request.body.items,
                path, paymentMethod: request.body.paymentMethod,
                type: request.body.type,
                totalPrice: request.body.totalPrice
            });
        }
        catch (error: any)  {
            console.error(error);

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

        // Create new order
        try {
            await this.useDomainManager(
                async domainManager => domainManager.newOrder({ type, items, path, paymentMethod, totalPrice, createdBy: user.Email, orderedBy: request.body.orderedBy })
            );
        }
        catch (error: any) {
            console.error(error);

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