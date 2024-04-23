import Order from "../../../domain/entities/upgrade/Order";
import OrderItem from "../../../domain/entities/upgrade/OrderItem";
import DomainManager from "../../../domain/upgrade/DomainManager";
import RestfulError from "../../errors/RestfulError";
import PermissionRequiredRestfulController from "../abstracts/upgrade/PermissionRequiredRestfulController";
import RestfulControllerParam from "../interfaces/RestfulControllerParam";

export default class RemoveOrderController extends PermissionRequiredRestfulController {
    //Constructors:
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);
    }

    //Methods:
    public async execute({ request, response }: RestfulControllerParam): Promise<void> {
        //Path initialazation 
        const path: any[] = [];

        //Validate
        try {
            await this.managerValidateController.execute({ request, path});
        } catch (error: any) {
            if(error instanceof RestfulError) {
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

        //Get id 
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
                async function (domainManager) {
                    return domainManager.getOrder(id,path);
                }
            )
        } catch (error: any) {
            console.error(error);

            response.json(
                {
                    success:false,
                    message:"Failed while handling with DB!",
                    code:"HANDLING_DB_FAILED"
                }
            );
            return;
        }

        if(!order) {
            response.json(
                {
                    success:false,
                    message:"Order is not exist!",
                    code: "ORDER_NOT_EXIST"
                }
            )
            return;
        }

        //Remove order
        try {
            for(const orderItem of await order.getItems()) {
                await this.useDomainManager(
                    async function(domainManager){
                        return domainManager.removeOrderItem(orderItem as OrderItem);
                    }
                )
            }

            await this.useDomainManager(
                async function(domainManager) {
                    return domainManager.removeOrder(order as Order);
                }
            )
        } catch (error: any) {
            console.error(error);

            response.json(
                {
                success:false,
                message: "Failed while handling with DB!",
                code : "HANDLING_DB_FAILED"
                }
            );
            return;
        }

        response.json(
            {success: true}
        );
    }
}