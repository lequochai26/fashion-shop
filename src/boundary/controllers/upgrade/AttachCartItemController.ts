import User from "../../../domain/entities/upgrade/User";
import Cart from "../../../domain/upgrade/Cart";
import DomainManager from "../../../domain/upgrade/DomainManager";
import Session from "../../../utils/Session";
import RestfulError from "../../errors/RestfulError";
import PermissionRequiredRestfulController from "../abstracts/upgrade/PermissionRequiredRestfulController";
import RestfulControllerParam from "../interfaces/RestfulControllerParam";

export default class AttachCartItemController extends PermissionRequiredRestfulController {
    // Constructors:
    public constructor(domainManager?: DomainManager | undefined) {
        super(domainManager);
    }

    // Methods:
    public async execute({ request, response }: RestfulControllerParam): Promise<void> {
        // Path definition
        const path: any[] = [];

        // Login validating
        let user: User | undefined = undefined;
        try {
            const loginValidatePath = await this.loginValidateController.execute({ request, path });
            user = loginValidatePath.user;
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
                    code: "HANDLING_DB_FAILED"
                });
            }
            return;
        }

        // Items
        const items: { id: string, metadata?: any | undefined }[] | undefined = request.body.items;

        if (!items) {
            response.json({
                success: false,
                message: "items parameter is required!",
                code: "ITEMS_REQUIRED"
            });
            return;
        }

        // Get session
        const session: Session = (request as any).session;

        // Get cart from session
        let sessionCart: Cart | undefined = session.get("cart");
        if (!sessionCart) {
            sessionCart = await this.useDomainManager(
                async domainManager => new Cart(domainManager)
            );
            session.put("cart", sessionCart);
        }

        // Validating items
        for (const { id, metadata } of items) {
            if (!await sessionCart.contains(id, metadata)) {
                response.json({
                    success: false,
                    message: (
                        !metadata
                        ?
                        `Item with id '${id}' not exist in session cart!`
                        :
                        `Item with id '${id}' and metadata '${JSON.stringify(metadata)}' not exist in session cart!`
                    )
                });
                return;
            }
        }

        // Get user's cart
        const cart: Cart = await this.useDomainManager(
            async domainManager => new Cart(domainManager, user)
        );

        // Attaching
        try {
            for (const item of items) {
                await sessionCart.attachItem(cart, path, item.id, item.metadata);
            }
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

        // Response
        response.json({
            success: true
        });
    }
}