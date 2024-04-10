import DomainManager from "../../domain/DomainManager";
import RestfulError from "../errors/RestfulError";
import NewOrderRestfulController from "./abstracts/NewOrderRestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";
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
        // Path initialize
        const path: any[] = [];

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
                response.json({
                    success: false,
                    message: "Error occurred!",
                    code: "ERROR_OCCURRED"
                });
            }

            return;
        }

        // Create new order
        try {
            await this.useDomainManager(
                async domainManager => domainManager.newOrder({ type, items, path, paymentMethod, totalPrice })
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