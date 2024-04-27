import CartItem from "../../../domain/entities/upgrade/CartItem";
import User from "../../../domain/entities/upgrade/User";
import Cart from "../../../domain/upgrade/Cart";
import DomainManager from "../../../domain/upgrade/DomainManager";
import AsyncConverter from "../../../utils/interfaces/AsyncConverter";
import Session from "../../../utils/Session";
import RestfulError from "../../errors/RestfulError";
import CartItemInfo from "../../infos/cartitem/CartItemInfo";
import QueryCartRestfulController from "../abstracts/upgrade/QueryCartRestfulController";
import RestfulControllerParam from "../interfaces/RestfulControllerParam";

export default class UpgradedGetCartController extends QueryCartRestfulController {
    // Constructors:
    public constructor(
        cartItemInfoConverter: AsyncConverter<CartItem, CartItemInfo>,
        domainManager?: DomainManager | undefined
    ) {
        super(cartItemInfoConverter, domainManager);
    }

    // Methods:
    public async execute({ request, response }: RestfulControllerParam): Promise<void> {
        // Path definition
        const path: any[] = [];

        // Get logged in user
        let user: User | undefined = undefined;
        try {
            const loginValidatePath = await this.loginValidateController.execute({ path, request });
            user = loginValidatePath.user;
        }
        catch (error: any) {
            if (!(error instanceof RestfulError)) {
                response.json({
                    success: false,
                    message: "Failed while handling with DB!"
                });
                return;
            }
        }

        // Get session
        const session: Session = (request as any).session;

        // Get session cart
        let sessionCart: Cart | undefined = session.get("cart");
        if (!sessionCart) {
            sessionCart = await this.useDomainManager(
                async domainManager => new Cart(domainManager)
            );

            session.put("cart", sessionCart);
        }

        const sessionCartItemInfos: CartItemInfo[] = [];
        for (const cartItem of await sessionCart.get(path)) {
            sessionCartItemInfos.push(await this.cartItemInfoConverter.convert(cartItem));
        }

        // Get user's cart
        let userCart: Cart | undefined = undefined;
        if (user) {
            userCart = await this.useDomainManager(
                async domainManager => new Cart(domainManager, user)
            );
        }

        let userCartItemInfos: CartItemInfo[] | undefined = undefined;
        if (userCart) {
            userCartItemInfos = [];
            for (const cartItem of await userCart.get(path)) {
                userCartItemInfos.push(await this.cartItemInfoConverter.convert(cartItem));
            }
        }

        // Response
        response.json({
            success: true,
            result: {
                sessionCart: sessionCartItemInfos,
                userCart: userCartItemInfos
            }
        });
    }
}