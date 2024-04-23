import ItemMetadata from "../../../domain/entities/ItemMetadata";
import Brand from "../../../domain/entities/upgrade/Brand";
import Item from "../../../domain/entities/upgrade/Item";
import ItemImage from "../../../domain/entities/upgrade/ItemImage";
import ItemType from "../../../domain/entities/upgrade/ItemType";
import DomainManager from "../../../domain/upgrade/DomainManager";
import RestfulError from "../../errors/RestfulError";
import PermissionRequiredRestfulController from "../abstracts/upgrade/PermissionRequiredRestfulController";
import RestfulControllerParam from "../interfaces/RestfulControllerParam";

export default class UpgradedNewItemController extends PermissionRequiredRestfulController {
    // Constructors:
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);
    }

    // Methods:
    public async execute({ request, response }: RestfulControllerParam): Promise<void> {
        // Path intialize
        const path: any[] = [];

        // MANAGER permission validation
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
        const id: string | undefined = request.body.id;

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

        // Check Id
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

        if (item) {
            response.json(
                {
                    success: false,
                    message: "Already exist an item with given id!",
                    code: "ITEM_ALREADY_EXIST"
                }
            );

            return;
        }

        // Name
        const name: string | undefined = request.body.name;

        if (!name) {
            response.json(
                {
                    success: false,
                    message: "name parameter is required!",
                    code: "NAME_REQUIRED"
                }
            );

            return;
        }

        // Description
        const description: string | undefined = request.body.description;

        if (!description) {
            response.json(
                {
                    success: false,
                    message: "description parameter is required!",
                    code: "DESCRIPTION_REQUIRED"
                }
            );

            return;
        }

        // Gender
        const genderStr: string | undefined = request.body.gender;

        if (!genderStr) {
            response.json(
                {
                    success: false,
                    message: "gender parameter is required!",
                    code: "GENDER_REQUIRED"
                }
            );

            return;
        }

        const gender: boolean = genderStr === 'true';

        // Amount
        const amountStr: string | undefined = request.body.amount;

        if (!amountStr) {
            response.json(
                {
                    success: false,
                    message: "amount parameter is required!",
                    code: "AMOUNT_REQUIRED"
                }
            );

            return;
        }

        let amount: number = Number.parseInt(amountStr);

        if (
            Number.isNaN(amount) ||
            amount < 0
        ) {
            response.json(
                {
                    success: false,
                    message: "amount must be a number that greater than or equals to 0.",
                    code: "AMOUNT_INVALID"
                }
            );

            return;
        }

        // Price
        const priceStr: string | undefined = request.body.price;

        if (!priceStr) {
            response.json(
                {
                    success: false,
                    message: "price parameter is required!",
                    code: "PRICE_REQUIRED"
                }
            );

            return;
        }

        let price: number = Number.parseFloat(priceStr);
        if (
            Number.isNaN(price) ||
            price < 0
        ) {
            response.json(
                {
                    success: false,
                    message: "price must be a number that greater than or equals to 0.",
                    code: "PRICE_INVALID"
                }
            );

            return;
        }

        // BuyPrice
        const buyPriceStr: string | undefined = request.body.buyPrice;

        if (!buyPriceStr) {
            response.json({
                success: false,
                message: "buyPrice parameter is required!",
                code: "BUYPRICE_REQUIRED"
            });
            return;
        }

        let buyPrice: number = Number.parseFloat(buyPriceStr);
        if (
            Number.isNaN(buyPrice) || buyPrice < 0
        ) {
            response.json({
                success: false,
                message: "buyPrice must be a number that greater than or equals to 0.",
                code: "BUYPRICE_INVALID"
            });
            return;
        }

        // Avatar
        const [ avatar ]: Express.Multer.File[] = this.getFiles(request, "avatar");

        if (!avatar) {
            response.json(
                {
                    success: false,
                    message: "Item's avatar is required!",
                    code: "AVATAR_REQUIRED"
                }
            );

            return;
        }

        // Check Avatar's file type
        if (
            !await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.isImageFile(avatar)
                }
            )
        ) {
            response.json(
                {
                    success: false,
                    message: "Item's avatar must be an image file!",
                    code: "AVATAR_INVALID"
                }
            );

            return;
        }

        // Get metadata
        const metadataStr: string | undefined = request.body.metadata;

        let metadata: ItemMetadata | undefined = undefined;
        if (metadataStr) {
            try {
                metadata = new ItemMetadata(JSON.parse(metadataStr));
            }
            catch (error: any) {
                response.json(
                    {
                        success: false,
                        message: "Invalid metadata!",
                        code: "METADATA_INVALID"
                    }
                );

                return;
            }
        }

        // Type
        const typeId: string | undefined = request.body.type;

        let type: ItemType | undefined;
        if (typeId) {
            try {
                type = await this.useDomainManager(
                    async function (domainManager) {
                        return domainManager.getItemType(typeId, path);
                    }
                )
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

            if (!type) {
                response.json(
                    {
                        success: false,
                        message: "Given item type doesn't exist!",
                        code: "TYPE_NOT_EXIST"
                    }
                );

                return;
            }
        }

        // Brand
        const brandId: string | undefined = request.body.brand;

        let brand: Brand | undefined;
        if (brandId) {
            try {
                brand = await this.useDomainManager(
                    async function (domainManager) {
                        return domainManager.getBrand(brandId, path);
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

            if (!brand) {
                response.json(
                    {
                        success: false,
                        message: "Given brand doesn't exist!",
                        code: "BRAND_NOT_EXIST"
                    }
                );

                return;
            }
        }

        // Write avatar
        let avatarPath: string;
        try {
            const avatarFileName = await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.writeFileAutoName("./assets/itemImages", avatar);
                }
            );

            avatarPath = `/assets/itemImages/${avatarFileName}`
        }
        catch (error: any) {
            console.error(error);

            response.json(
                {
                    success: false,
                    message: "Failed while writing avatar!",
                    code: "WRITING_AVATAR_FAILED"
                }
            );

            return;
        }

        // Inserting item
        item = new Item();
        item.Id = id;
        item.Amount = amount;
        item.Avatar = avatarPath;
        item.Brand = brand;
        item.Description = description;
        item.Gender = gender;
        item.Metadata = metadata;
        item.Name = name;
        item.Price = price;
        item.BuyPrice = buyPrice;
        item.Type = type;

        try {
            await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.insertItem(item as Item);
                }
            );
        }
        catch (error: any) {
            console.error(error);

            try {
                await this.useDomainManager(
                    async domainManager => domainManager.deleteFile(avatarPath)
                );
            }
            catch (error: any) {
                console.error(error);
            }

            response.json(
                {
                    success: false,
                    message: "Failed while handling with DB!",
                    code: "HANDLING_DB_FAILED"
                }
            );

            return;
        }

        // Get images files
        const imagesFiles: Express.Multer.File[] = this.getFiles(request, "images");

        if (imagesFiles.length > 0) {
            const wroteImagesPath: string[] = [];

            for (const imageFile of imagesFiles) {
                if (
                    !await this.useDomainManager(
                        async domainManager => domainManager.isImageFile(imageFile)
                    )
                ) {
                    continue;
                }

                try {
                    wroteImagesPath.push(
                        `/assets/itemImages/${await this.useDomainManager(async domainManager => domainManager.writeFileAutoName("./assets/itemImages", imageFile))}`
                    );
                }
                catch (error: any) {
                    console.error(error);
                }
            }

            // At least 1 item image file wrote successful
            if (wroteImagesPath.length > 0) {
                const itemImages: ItemImage[] = [];

                for (const wroteImagePath of wroteImagesPath) {
                    itemImages.push(
                        new ItemImage(wroteImagePath, item)
                    );
                }

                for (const itemImage of itemImages) {
                    try {
                        await this.useDomainManager(
                            async function (domainManager) {
                                return domainManager.insertItemImage(itemImage);
                            }
                        );
                    }
                    catch (error: any) {
                        console.error(error);

                        try {
                            await this.useDomainManager(
                                async domainManager => domainManager.removeItemImage(itemImage)
                            );
                        }
                        catch (error: any) {
                            console.error(error);
                        }
                    }
                }
            }
        }

        // Successful responding
        response.json(
            { success: true }
        );
    }
}