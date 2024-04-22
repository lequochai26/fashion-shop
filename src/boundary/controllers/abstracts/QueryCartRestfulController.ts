import DomainManager from "../../../domain/DomainManager";
import CartItem from "../../../domain/entities/CartItem";
import Converter from "../../../utils/interfaces/Converter";
import CartItemInfo from "../../infos/cartitem/CartItemInfo";
import PermissionRequiredRestfulController from "./PermissionRequiredRestfulController";

export default abstract class QueryCartRestfulController extends PermissionRequiredRestfulController {
    // Fields:
    protected cartItemInfoConverter: Converter<CartItem, CartItemInfo>;

    // Constructors:
    public constructor(
        cartItemInfoConverter: Converter<CartItem, CartItemInfo>,
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);

        this.cartItemInfoConverter = cartItemInfoConverter;
    }
}