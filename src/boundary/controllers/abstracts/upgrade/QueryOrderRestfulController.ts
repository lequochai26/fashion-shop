import Order from "../../../../domain/entities/upgrade/Order";
import DomainManager from "../../../../domain/upgrade/DomainManager";
import AsyncConverter from "../../../../utils/interfaces/AsyncConverter";
import OrderInfo from "../../../infos/order/OrderInfo";
import PermissionRequiredRestfulController from "./PermissionRequiredRestfulController";

export default abstract class QueryOrderRestfulController extends PermissionRequiredRestfulController {
    // Fields 
    protected orderInfoConverter: AsyncConverter<Order, OrderInfo>;

    // Constructors:
    public constructor(
        orderInfoConverter: AsyncConverter<Order, OrderInfo>,
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);
        this.orderInfoConverter = orderInfoConverter;
    }
}