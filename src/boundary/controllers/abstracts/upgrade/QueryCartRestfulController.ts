import CartItem from "../../../../domain/entities/upgrade/CartItem";
import DomainManager from "../../../../domain/upgrade/DomainManager";
import AsyncConverter from "../../../../utils/interfaces/AsyncConverter";
import CartItemInfo from "../../../infos/cartitem/CartItemInfo";
import PermissionRequiredRestfulController from "./PermissionRequiredRestfulController";

export default abstract class QueryCartRestfulController extends PermissionRequiredRestfulController {
    // Fields:
    protected cartItemInfoConverter: AsyncConverter<CartItem, CartItemInfo>;

    // Constructors:
    public constructor(
        cartItemInfoConverter: AsyncConverter<CartItem, CartItemInfo>,
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);

        this.cartItemInfoConverter = cartItemInfoConverter;
    }
}