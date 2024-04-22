import DomainManager from "../../../domain/DomainManager";
import Order from "../../../domain/entities/Order";
import Converter from "../../../utils/interfaces/Converter";
import OrderInfo from "../../infos/order/OrderInfo";
import PermissionRequiredRestfulController from "./PermissionRequiredRestfulController";

export default abstract class QueryOrderRestfulController extends PermissionRequiredRestfulController {
    // Fields 
    protected orderInfoConverter: Converter<Order, OrderInfo>;

    // Constructors:
    public constructor(
        orderInfoConverter: Converter<Order, OrderInfo>,
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);
        this.orderInfoConverter = orderInfoConverter;
    }
}