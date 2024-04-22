import Cart from "../../domain/Cart";
import DomainManager from "../../domain/DomainManager";
import User from "../../domain/entities/User";
import Session from "../../utils/Session";
import RestfulError from "../errors/RestfulError";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";
import PermissionRequiredRestfulController from "./abstracts/PermissionRequiredRestfulController";

export default class RemoveCartItemController extends PermissionRequiredRestfulController {
    // Constructors:
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);
    }

    // Methods:
    public async execute({ request, response }: RestfulControllerParam): Promise<void> {
        // Items
        const items: { id: string, amount: number, metadata?: any | undefined }[] | undefined = request.body.items;

        if (!items) {
            response.json({
                success: false,
                message: "items parameter is required!",
                code: "ITEMS_REQUIRED"
            });
            return;
        }

        // Validate items
        for (const item of items) {
            if (!item.id) {
                response.json({
                    success: false,
                    message: "items invalid!",
                    code: "ITEMS_INVALID"
                });
                return;
            }
        }

        // Path initialize
        const path: any[] = [];

        // Validate login
        let user: User | undefined;

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
        let cart: Cart | undefined;

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

        // Remove cart item operation
        try {
            for (const { id, amount, metadata } of items) {
                await cart.removeItem(id, path, amount, metadata);
            }
        }
        catch (error: any) {
            switch (error) {
                case Cart.CARTITEM_NOT_FOUND: {
                    response.json({
                        success: false,
                        message: "Cart's item not found!",
                        code: "CARTITEM_NOT_FOUND"
                    });
                    break;
                }

                default: {
                    console.error(error);
                    response.json({
                        success: false,
                        message: "Failed while handling with DB!",
                        code: "HANDLING_DB_FAILED"
                    });
                }
            }

            return;
        }

        // Response
        response.json({ success: true });
    }
}