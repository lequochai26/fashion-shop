import DomainManager from "../../../domain/DomainManager";
import Order from "../../../domain/entities/Order";
import Converter from "../../../utils/interfaces/Converter";
import OrderInfo from "../../infos/order/OrderInfo";
import RestfulController from "./RestfulController";

export default abstract class QueryOrderRestfulController extends RestfulController {
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