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

        // Metadata
        const metadata: any | undefined = request.body.metadata;

        // Login validate
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

        // Add cartItem
        try {
            await cart.addItem(id, amount, path, metadata);
        }
        catch (error: any) {
            response.json({
                success: false,
                message: "Failed while handling with DB!",
                code: "HANDLING_DB_FAILED"
            });
            return;
        }

        // Response
        response.json({ success: true });
    }
}