import Cart from "../../domain/Cart";
import DomainManager from "../../domain/DomainManager";
import User from "../../domain/entities/User";
import Session from "../../utils/Session";
import RestfulError from "../errors/RestfulError";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";
import PermissionRequiredRestfulController from "./PermissionRequiredRestfulController";

export default class AddCartItemController extends PermissionRequiredRestfulController {
    // Constructors:
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);
    }

    // Methods:
    public async execute({ request, response }: RestfulControllerParam): Promise<void> {
        // Id
        const id: string | undefined = request.body.id;

        if (!id) {
            response.json({
                success: false,
                message: "id parameter is required!",
                code: "ID_REQUIRED"
            });
            return;
        }

        // Path initialize
        const path: any[] = [];

        if (
            !await this.useDomainManager(
                async domainManager => domainManager.getItem(id, path)
            )
        ) {
            response.json({
                success: false,
                message: "Item not exist!",
                code: "ITEM_NOT_EXIST"
            });
            return;
        }

        // Amount
        let amount: number | undefined = request.body.amount;

        if (!amount) {
            amount = 1;
        }

        // Add cart item
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

        // Logged in case
        if (user) {
            const cart: Cart = await this.useDomainManager(
                async domainManager => new Cart(domainManager, user)
            );

            try {
                await cart.addItem(id, amount, path, request.body.metadata);
            }
            catch (error: any) {
                response.json({
                    success: false,
                    message: "Failed while handling with DB!",
                    code: "HANDLING_DB_FAILED"
                });
                return;
            }
        }
        // Not logged in case
        else {
            // Get session
            const session: Session = (request as any).session;

            // Get cart from session
            let cart: Cart | undefined = session.get("cart");

            // If not cart
            if (!cart) {
                cart = await this.useDomainManager(
                    async domainManager => new Cart(domainManager)
                );

                session.put("cart", cart);
            }

            // Add cart item
            await cart.addItem(id, amount, path, request.body.metadata);
        }

        // Response
        response.json({ success: true });
    }
}