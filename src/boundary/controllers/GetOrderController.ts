import DomainManager from "../../domain/DomainManager";
import Order from "../../domain/entities/Order";
import UserPermission from "../../domain/enums/UserPermission";
import Converter from "../../utils/interfaces/Converter";
import RestfulError from "../errors/RestfulError";
import OrderInfo from "../infos/order/OrderInfo";
import EmployeeValidateController from "./EmployeeValidateController";
import QueryOrderRestfulController from "./abstracts/QueryOrderRestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";

export default class GetOrderController extends QueryOrderRestfulController {
    //Fields
    //Constructor
    public constructor(
        orderInfoConverter: Converter<Order, OrderInfo>,
        domainManager?: DomainManager | undefined

    ) {
        super(orderInfoConverter, domainManager)
    }

    //Methods

    public async execute({ response, request }: RestfulControllerParam): Promise<void> {
        const path: any[] = [];

        //validate
        try {
            var { user } = await this.loginValidateController.execute({ request, path });

        } catch (error: any) {
            if (error instanceof RestfulError) {
                response.json(
                    {
                        success: false,
                        message: error.message,
                        code: error.Code
                    }
                );

                return;
            }

            else {
                response.json({
                    success: false,
                    message: "Failed while handling with DB",
                    code: "HANDLING_DB_FAILED"
                });

                return;
            }
        }

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

        if (user.Permission === UserPermission.EMPLOYEE || user.Permission === UserPermission.MANAGER) {

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

            if (!order) {
                response.json(
                    {
                        success: false,
                        message: "order not exist!",
                        code: "ORDER_NOT_EXIST"
                    }
                );
    
                return;
            }

            response.json(
                {
                    success: true,
                    result: order
                }
            )
        }

        const ordered: Order | undefined = user.OrderedOrders.find((ordered) => {
                return ordered.Id === id;
        });

        if (!ordered) {
            response.json(
                {
                    success: false,
                    message: "order not exist!",
                    code: "ORDER_NOT_EXIST"
                }
            );

            return;
        }

        //Hệ thống kiểm tra và xác nhận người này có đặt đơn hàng được yêu cầu truy vấn.
        response.json(
            {
                success: true,
                order: ordered
            }
        )

    }
}