import Cart from "../../domain/Cart";
import DomainManager from "../../domain/DomainManager";
import OrderItem from "../../domain/entities/OrderItem";
import OrderType from "../../domain/enums/OrderType";
import RestfulError from "../errors/RestfulError";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";
import PermissionRequiredRestfulController from "./PermissionRequiredRestfulController";

export default class UpgradedCreateOrderController extends PermissionRequiredRestfulController {
    // Constructors:
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);
    }

    // Methods:
    public async execute({ request, response }: RestfulControllerParam): Promise<void> {
        // Path initial
        const path: any[] = [];

        // Validate login
        try {
            var { user } = await this.loginValidateController.execute({ request, path });
        }
        catch (error: any) {
            if (error instanceof RestfulError) {
                response.json({
                    success: false,
                    message: error.message,
                    code: error.Code
                });
            }
            else {
                console.error(error);
                response.json({
                    success: false,
                    message: "Failed while handling with DB!",
                    code: "HANDLING_FB_FAILED"
                });
            }
            return;
        }

        // Check if user's cart has at least 1 item
        if (user.Cart.length < 1) {
            response.json({
                success: false,
                message: "No item in cart!",
                code: "NO_ITEM_IN_CART"
            });
            return;
        }

        // Get neccessary informations for create order
        const type: string = OrderType.SELL;
        const orderedBy: string = user.Email as string;
        const orderItems: { id: string, amount: number, metadata: any }[] = user.Cart.map(
            cartItem => ({ id: cartItem.Item?.Id as string, amount: cartItem.Amount as number, metadata: cartItem.Metadata })
        );

        try {
            await this.useDomainManager(
                async domainManager => domainManager.newOrder({ items: orderItems, path, type, orderedBy })
            );
        }
        catch(error: any) {
            console.error(error);
            response.json({
                success: false,
                message: "Failed while handling with DB!",
                code: "HANDLING_DB_FAILED"
            });
            return;
        }

        // Clear user's cart
        const cart: Cart = await this.useDomainManager(
            async domainManager => new Cart(domainManager, user)
        );

        try {
            await cart.clear();
        }
        catch (error: any) {
            console.error(error);
            response.json({
                success: false,
                message: "Failed while handling with DB!",
                code: "HANDLING_DB_FAILED"
            });
            return;
        }

        // Response back to client
        response.json({ success: true });
    }
}