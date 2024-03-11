import DomainManager from "../../domain/DomainManager";
import Brand from "../../domain/entities/Brand";
import Item from "../../domain/entities/Item";
import ItemImage from "../../domain/entities/ItemImage";
import ItemType from "../../domain/entities/ItemType";
import UpdateItemRestfulController from "./abstracts/UpdateItemRestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";

export default class UpgradedNewItemController extends UpdateItemRestfulController {
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

        let amount: number;
        try {
            amount = Number.parseInt(amountStr);

            if (amount < 0) {
                throw new Error();
            }
        }
        catch (error: any) {
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

        let price: number;
        try {
            price = Number.parseFloat(priceStr);

            if (price < 0) {
                throw new Error();
            }
        }
        catch (error: any) {
            response.json(
                {
                    success: false,
                    message: "price must be a number that greater than or equals to 0.",
                    code: "PRICE_INVALID"
                }
            );

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
        const [ avatarFileType, avatarFileExtension ]: string[] = avatar.mimetype.split("/");

        if (avatarFileType !== 'image') {
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

        let metadata: any;
        if (metadataStr) {
            try {
                metadata = JSON.parse(metadataStr);

                if (
                    !await this.useDomainManager(
                        async function (domainManager) {
                            return domainManager.validateItemMetadata(metadata);
                        }
                    )
                ) {
                    throw new Error();
                }
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
            avatarPath = await this.writeFileNamingByDateTimeController.execute(
                {
                    destination: UpdateItemRestfulController.itemImagesStoragePath,
                    buffer: avatar.buffer,
                    extension: avatarFileExtension
                }
            );
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
                await this.deleteFileController.execute(avatarPath);
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
            for (const imageFile of imagesFiles) {
                const [ imageFileType, imageFileExtension ] = imageFile.mimetype.split("/");

                if (imageFileType !== 'image') {
                    continue;
                }

                const wroteImagesPath: string[] = [];

                try {
                    wroteImagesPath.push(
                        await this.writeFileNamingByDateTimeController.execute(
                            {
                                buffer: imageFile.buffer,
                                destination: UpdateItemRestfulController.itemImagesStoragePath,
                                extension: imageFileExtension
                            }
                        )
                    );
                }
                catch (error: any) {
                    console.error(error);
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
                                await this.deleteFileController.execute(itemImage.Path as string);
                            }
                            catch (error: any) {
                                console.error(error);
                            }
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