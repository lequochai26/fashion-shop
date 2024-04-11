import Cart from "../../domain/Cart";
import DomainManager from "../../domain/DomainManager";
import CartItem from "../../domain/entities/CartItem";
import User from "../../domain/entities/User";
import Converter from "../../utils/interfaces/Converter";
import Session from "../../utils/Session";
import RestfulError from "../errors/RestfulError";
import CartItemInfo from "../infos/cartitem/CartItemInfo";
import QueryCartRestfulController from "./abstracts/QueryCartRestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";

export default class GetCartController extends QueryCartRestfulController {
    // Constructors:
    public constructor(
        cartItemInfoConverter: Converter<CartItem, CartItemInfo>,
        domainManager?: DomainManager | undefined
    ) {
        super(cartItemInfoConverter, domainManager);
    }

    // Methods:
    public async execute({ request, response }: RestfulControllerParam): Promise<void> {
        // Path initialize
        const path: any[] = [];

        // Validate login
        let user: User | undefined = undefined;
        try {
            const loginValidatePath = await this.loginValidateController.execute({ request, path });
            user = loginValidatePath.user;
        }
        catch (error: any) {
            if (!(error instanceof RestfulError)) {
                response.json({
                    success: false,
                    message: "Failed while handling with DB!",
                    code: "HANDLING_DB_FAILED"
                });
                return;
            }
        }

        // Get cart
        let cart: Cart | undefined = undefined;

        if (user) {
            cart = await this.useDomainManager(
                async domainManager => new Cart(domainManager, user)
            );
        }
        else {
            const session: Session = (request as any).session;
            cart = session.get("cart");
            if (!cart) {
                cart = await this.useDomainManager(
                    async domainManager => new Cart(domainManager)
                );
                session.put("cart", cart);
            }
        }

        // Get
        try {
            var cartItems: CartItem[] = await cart.get(path);
        }
        catch (error: any) {
            response.json({
                success: false,
                message: "Failed while handling with DB!",
                code: "HANDLING_DB_FAILED"
            });
            return;
        }

        // Convert cartItems
        const result: CartItemInfo[] = [];
        for (const cartItem of cartItems) {
            result.push(
                this.cartItemInfoConverter.convert(cartItem)
            );
        }

        // Response
        response.json({
            success: true,
            result
        });
    }
}