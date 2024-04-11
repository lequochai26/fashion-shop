import DomainManager from "../../domain/DomainManager";
import Order from "../../domain/entities/Order";
import OrderItem from "../../domain/entities/OrderItem";
import RestfulError from "../errors/RestfulError";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";
import PermissionRequiredRestfulController from "./PermissionRequiredRestfulController";

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
            for(const orderItem of order.Items) {
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