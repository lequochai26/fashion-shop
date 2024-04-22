import DomainManager from "../../domain/DomainManager";
import Item from "../../domain/entities/Item";
import RestfulError from "../errors/RestfulError";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";
import PermissionRequiredRestfulController from "./abstracts/PermissionRequiredRestfulController";

export default class RemoveItemController extends PermissionRequiredRestfulController {
    // Constructors:
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);
    }

    // Methods:
    public async execute({ request, response }: RestfulControllerParam): Promise<void> {
        // Path initialize
        const path: any[] = [];

        // MANAGER permission validate
        try {
            await this.managerValidateController.execute({ request, path });
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

        // Id
        const id: string | undefined = request.query.id as string | undefined;

        if (!id) {
            response.json(
                {
                    success: false,
                    message: "id parameter is required!",
                    code: "ID_REQUIRED"
                }
            );

            return;
        }

        // Get item
        let item: Item | undefined;
        try {
            item = await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.getItem(id, path);
                }
            );
        }
        catch (error: any) {
            console.error(error);

            response.json(
                {
                    success: false,
                    message: "Failed while handling with DB!",
                    code: "HANDLING_DB_FAILED"
                }
            );

            return;
        }

        if (!item) {
            response.json(
                {
                    success: false,
                    message: "Item not exist!",
                    code: "ITEM_NOT_EXIST"
                }
            );

            return;
        }

        // Order dependency
        if (item.Orders.length > 0) {
            response.json(
                {
                    success: false,
                    message: "Make sure there's no order linked to this item before performing this action!",
                    code: "ORDER_LINKED"
                }
            );

            return;
        }

        // User dependency
        if (item.Users.length > 0) {
            response.json({
                success: false,
                message: "Make sure there's no user linked to this item before performing this action!",
                code: "USER_LINKED"
            });
            return;
        }

        // Delete item
        try {
            await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.removeItem(item as Item);
                }
            );
        }
        catch (error: any) {
            console.error(error);

            response.json(
                {
                    success: false,
                    message: "Failed while handling with DB!",
                    code: "HANDLING_DB_FAILED"
                }
            );

            return;
        }

        // Delete item's avatar
        try {
            await this.useDomainManager(
                async domainManager => domainManager.deleteFile(`.${item?.Avatar}`)
            );
        }
        catch (error: any) {
            console.error(error);
        }

        // Delete item's images if have
        if (item.Images.length > 0) {
            const deletedImagesPath: string[] = [];

            for (const image of item.Images) {
                try {
                    await this.useDomainManager(
                        async function (domainManager) {
                            return domainManager.removeItemImage(image);
                        }
                    );
                    deletedImagesPath.push(image.Path as string);
                }
                catch (error: any) {
                    console.error(error);
                }
            }

            if (deletedImagesPath.length > 0) {
                for (const deletedImagePath of deletedImagesPath) {
                    try {
                        await this.useDomainManager(
                            async domainManager => domainManager.deleteFile(`.${deletedImagePath}`)
                        );
                    }
                    catch (error: any) {
                        console.error(error);
                    }
                }
            }
        }

        // Responding to client
        response.json({ success: true });
    }
}