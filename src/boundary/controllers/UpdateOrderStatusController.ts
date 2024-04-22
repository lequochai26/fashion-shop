import DomainManager from "../../domain/DomainManager";
import Order from "../../domain/entities/Order";
import OrderStatus from "../../domain/enums/OrderStatus";
import RestfulError from "../errors/RestfulError";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";
import PermissionRequiredRestfulController from "./abstracts/PermissionRequiredRestfulController";

export default class UpdateOrderStatusController extends PermissionRequiredRestfulController {
    //Constructors:
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);
    }

    //Methods:
    public async execute({ request, response }: RestfulControllerParam): Promise<void> {
        //Path initialaztion
        const path: any[] = [];

        //Validate
        try {
            this.employeeValidateController.execute({ request, path });
        } catch (error : any) {
            if(error instanceof RestfulError ){
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

        //Get orderId and status
        const id: string | undefined = request.query.id as string;

        if(!id) {
            response.json(
                {
                    success: false,
                    message: "id parameter is required!",
                    code: "ID_REQUIRED"
                }
            );

            return;
        }
        
        let order: Order | undefined;
        try {
            order = await this.useDomainManager(
                async function(domainManager) {
                    return domainManager.getOrder(id, path);
                }
            );
        } catch (error: any) {
            response.json(
                {
                    success: false,
                    message: "Failed while handling with DB!",
                    code: "HANDLING_DB_FAILED"
                }
            );

            return;
        }

        if(!order) {
            response.json(
                {
                    success: false,
                    message: "Order not exist!",
                    code: "ORDER_NOT_EXIST"
                }
            );

            return;
        }

        const status: string|undefined = request.query.status as string;

        if(!status) {
            response.json(
                {
                    success: false,
                    message: "status parameter is required!",
                    code: "STATUS_REQUIRED"
                }
            );

            return;
        }

        if(!Object.values(OrderStatus).includes(status as OrderStatus)){
            response.json(
                {
                    success: false,
                    message:"Status invalid",
                    code: "STATUS_INVALID"
                }
            );

            return;
        }

        order.Status = status;
        try {
            await this.useDomainManager(
                async function(domainManager) {
                    return domainManager.updateOrder(order as Order);
                }
            )
        } catch (error:  any) {
            response.json(
                {
                    sucess: false,
                    message: "Failed while handling with DB!",
                    code: "HANDLING_DB_FAILED"
                }
            );

            return;
        }

        response.json(
            { success: true }
        );
    }
}