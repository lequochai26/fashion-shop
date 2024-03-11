import DomainManager from "../../domain/DomainManager";
import Brand from "../../domain/entities/Brand";
import Item from "../../domain/entities/Item";
import ItemType from "../../domain/entities/ItemType";
import UpdateItemRestfulController from "./abstracts/UpdateItemRestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";
import ItemImage from "../../domain/entities/ItemImage";

export default class UpdateItemController extends UpdateItemRestfulController {
    // Constructors:
    public constructor(domainManager?: DomainManager | undefined) {
        super(domainManager);
    }

    // Methods:
    public async execute({ request, response }: RestfulControllerParam): Promise<void> {
        // ID
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

        // Path initialization
        const path: any[] = [];

        // Item
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

        // Name
        const name: string | undefined = request.body.name;

        if (name) {
            item.Name = name;
        }

        // Description
        const description: string | undefined = request.body.description;

        if (description) {
            item.Description = description;
        }

        // Price
        const priceStr: string | undefined = request.body.price;

        if (priceStr) {
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

            item.Price = price;
        }

        // Amount
        const amountStr: string | undefined = request.body.amount;

        if (amountStr) {
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

            item.Amount = amount;
        }

        // Gender
        const genderStr: string | undefined = request.body.gender;

        if (genderStr) {
            const gender: boolean = genderStr === 'true';

            item.Gender = gender;
        }

        // Metadata
        const metadataStr: string | undefined = request.body.metadata;

        if (metadataStr) {
            let metadata: any;

            try {
                metadata = JSON.parse(metadataStr);

                if (!await this.useDomainManager(
                    async function (domainManager) {
                        return domainManager.validateItemMetadata(metadata);
                    }
                )) {
                    throw new Error();
                }
            }
            catch (error: any) {
                response.json(
                    {
                        success: false,
                        message: "Metadata invalid!",
                        code: "METADATA_INVALID"
                    }
                );

                return;
            }

            item.Metadata = metadata;
        }

        // Type
        const typeId: string | undefined = request.body.type;

        if (typeId) {
            let type: ItemType | undefined;
            try {
                type = await this.useDomainManager(
                    async function (domainManager) {
                        return domainManager.getItemType(typeId, path);
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

            item.Type = type;
        }

        // Brand
        const brandId: string | undefined = request.body.brand;

        if (brandId) {
            let brand: Brand | undefined;
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

            item.Brand = brand;
        }

        // Avatar
        let oldAvatarPath: string = item.Avatar as string;

        const [ avatar ]: Express.Multer.File[] = this.getFiles(request, "avatar");

        if (avatar) {
            const [ avatarFileType, avatarFileExtension ]: string[] = avatar.mimetype.split("/");

            if (avatarFileType !== 'image') {
                response.json(
                    {
                        success: false,
                        message: "Avatar must be an image file!",
                        code: "AVATAR_INVALID"
                    }
                );

                return;
            }

            try {
                item.Avatar = await this.writeFileNamingByDateTimeController.execute(
                    {
                        buffer: avatar.buffer,
                        destination: UpdateItemRestfulController.itemImagesStoragePath,
                        extension: avatarFileExtension
                    }
                );
            }
            catch (error: any) {
                console.error(error);
            }
        }

        // Update to DB
        try {
            await this.useDomainManager(
                async function (domainManager) {
                    domainManager.updateItem(item as Item);
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

        // Item updated avatar
        if (item.Avatar !== oldAvatarPath) {
            try {
                await this.deleteFileController.execute(oldAvatarPath);
            }
            catch (error: any) {
                console.error(error);
            }
        }

        // Images
        const images: Express.Multer.File[] = this.getFiles(request, "images")
        .filter(
            function (image) {
                return image.mimetype.split("/")[0] === 'image';
            }
        );

        if (images.length > 0) {
            // Writing images files
            const wroteImagesPath: string[] = [];
            for (const image of images) {
                try {
                    wroteImagesPath.push(
                        await this.writeFileNamingByDateTimeController.execute(
                            {
                                destination: UpdateItemRestfulController.itemImagesStoragePath,
                                buffer: image.buffer,
                                extension: image.mimetype.split("/")[1]
                            }
                        )
                    );
                }
                catch (error: any) {
                    console.error(error);
                }
            }

            if (wroteImagesPath.length > 0) {
                // Saving ItemImage entities into DB
                const itemImages: ItemImage[] = wroteImagesPath.map(
                    function (imagePath) {
                        return new ItemImage(imagePath, item);
                    }
                )

                let saved: boolean = false;

                for (const itemImage of itemImages) {
                    try {
                        await this.useDomainManager(
                            async function (domainManager) {
                                return domainManager.insertItemImage(itemImage);
                            }
                        );

                        if (!saved) {
                            saved = true;
                        }
                    }
                    catch (error: any) {
                        console.error(error);

                        try {
                            await this.deleteFileController.execute(itemImage.Path as string);
                        }
                        catch (error: any) {
                            console.error(error);
                        }
                    }
                }

                // Saved at least 1 new ItemImage entity
                if (saved) {
                    const deletedItemImagesPath: string[] = [];

                    for (const itemImage of item.Images) {
                        try {
                            await this.useDomainManager(
                                async function (domainManager) {
                                    return domainManager.removeItemImage(itemImage);
                                }
                            );

                            deletedItemImagesPath.push(itemImage.Path as string);
                        }
                        catch (error: any) {
                            console.error(error);
                        }
                    }

                    // Deleted as least 1 old ItemImage entity
                    if (deletedItemImagesPath.length > 0) {
                        for (const deleteItemImagePath of deletedItemImagesPath) {
                            try {
                                await this.deleteFileController.execute(deleteItemImagePath);
                            }
                            catch (error: any) {
                                console.error(error);
                            }
                        }
                    }
                }
            }
        }

        // Responding to client
        response.json({ success: true });
    }
}