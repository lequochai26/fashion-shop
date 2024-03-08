import { Request, Response } from "express";
import DomainManager from "../../domain/DomainManager";
import Brand from "../../domain/entities/Brand";
import Item from "../../domain/entities/Item";
import ItemImage from "../../domain/entities/ItemImage";
import ItemType from "../../domain/entities/ItemType";
import UpdateItemRestfulController from "./abstracts/UpdateItemRestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";

export default class NewItemController extends UpdateItemRestfulController {
    // Static fields:
    private static itemImageStoragePath: string = "./assets/itemImages"

    // Constructor:
    public constructor(domainManager?: DomainManager | undefined) {
        super(domainManager);
    }

    // Protected methods:
    protected validateId(
        request: Request,
        response: Response,
        onSuccess: (_id: string) => void,
        onNotFound: (response: Response) => void = function (response) {
            response.json(
                {
                    success: false,
                    message: "id parameter is required!",
                    code: "ID_REQUIRED"
                }
            );
        }
    ): boolean {
        // Get id
        const id: string | undefined = request.body.id;

        // Not found
        if (!id) {
            onNotFound(response);
            return false;
        }

        // Success
        onSuccess(id);
        return true;
    }

    protected validateName(
        request: Request,
        response: Response,
        onSuccess: (_name: string) => void,
        onNotFound: (response: Response) => void = function (response) {
            response.json(
                {
                    success: false,
                    message: "name parameter is required!",
                    code: "NAME_REQUIRED"
                }
            );
        }
    ): boolean {
        // Get name
        const name: string | undefined = request.body.name;

        // Not found
        if (!name) {
            onNotFound(response);
            return false;
        }

        // Success
        onSuccess(name);
        return true;
    }

    protected validateDescription(
        request: Request,
        response: Response,
        onSuccess: (_description: string) => void,
        onNotFound: (response: Response) => void = function (response) {
            response.json(
                {
                    success: false,
                    message: "description parameter is required!",
                    code: "DESCRIPTION_REQUIRED"
                }
            );
        }
    ): boolean {
        // Get description
        const description: string | undefined = request.body.description;

        // Not found
        if (!description) {
            onNotFound(response);
            return false;
        }

        // Success
        onSuccess(description);
        return true;
    }

    protected validateGender(
        request: Request,
        response: Response,
        onSuccess: (_gender: boolean) => void,
        onNotFound: (response: Response) => void = function (response) {
            response.json(
                {
                    success: false,
                    message: "gender parameter is required!",
                    code: "GENDER_REQUIRED"
                }
            );
        }
    ): boolean {
        // Get gender string
        const genderStr: string | undefined = request.body.gender;

        // Not found
        if (!genderStr) {
            onNotFound(response);
            return false;
        }

        // Parsing gender string to boolean
        const gender: boolean = genderStr == 'true';

        // Success
        onSuccess(gender);
        return true;
    }

    protected validateAmount(
        request: Request,
        response: Response,
        onSuccess: (_amount: number) => void,
        onNotFound: (response: Response) => void = function (response) {
            response.json(
                {
                    success: false,
                    message: "amount parameter is required!",
                    code: "AMOUNT_REQUIRED"
                }
            );
        },
        onParsingError: (response: Response, error: any) => void = function (response, error) {
            console.error(error);
            response.json(
                {
                    success: false,
                    message: "amount must be a number that greater than or equals to 0.",
                    code: "AMOUNT_INVALID"
                }
            );
            return;
        },
        onInvalid: (resposne: Response) => void = function (response) {
            response.json(
                {
                    success: false,
                    message: "amount must be a number that greater than or equals to 0.",
                    code: "AMOUNT_INVALID"
                }
            );
        }
    ): boolean {
        // Get amount string
        const amountStr: string | undefined = request.body.amount;

        // Not found
        if (!amountStr) {
            onNotFound(response);
            return false;
        }

        // Parsing
        let amount;
        try {
            amount = Number.parseInt(amountStr);
        }
        catch (error: any) {
            onParsingError(response, error);
            return false;
        }

        // Invalid
        if (amount < 0) {
            onInvalid(response);
            return false;
        }

        // Success
        onSuccess(amount);
        return true;
    }

    protected validatePrice(
        request: Request,
        response: Response,
        onSuccess: (_price: number) => void,
        onNotFound: (response: Response) => void = function (response) {
            response.json(
                {
                    success: false,
                    message: "price parameter is reuqired!",
                    code: "PRICE_REQUIRED"
                }
            );
        },
        onParsingError: (response: Response, error: any) => void = function (response, error) {
            console.error(error);
            response.json(
                {
                    success: false,
                    message: "price must be a number that greater than or equals to 0.",
                    code: "PRICE_INVALID"
                }
            );
        },
        onInvalid: (response: Response) => void = function (response) {
            response.json(
                {
                    success: false,
                    message: "price must be a number that greater than or equals to 0.",
                    code: "PRICE_INVALID"
                }
            );
        }
    ): boolean {
        // Get price string
        const priceStr: string | undefined = request.body.price;

        // Not found
        if (!priceStr) {
            onNotFound(response);
            return false;
        }

        // Parsing price into number
        let price: number;
        try {
            price = Number.parseFloat(priceStr);
        }
        catch (error: any) {
            onParsingError(response, error);
            return false;
        }

        // Success
        onSuccess(price);
        return true;
    }

    protected validateAvatar(
        request: Request,
        response: Response,
        onSuccess: (_avatar: Express.Multer.File, _files: Express.Multer.File[]) => void,
        onNotFound: (response: Response) => void = function (response) {
            response.json(
                {
                    success: false,
                    message: "Item's avatar is required!",
                    code: "AVATAR_REQUIRED"
                }
            );
        },
        onInvalid: (response: Response) => void = function (response) {
            response.json(
                {
                    success: false,
                    message: "Item's avatar must be an image file!",
                    code: "AVATAR_INVALID"
                }
            );
        }
    ): boolean {
        // Get uploaded files from request
        const files = request.files;

        // No files uploaded
        if (!files) {
            onNotFound(response);
            return false;
        }

        // Files not instance of array
        if (!(files instanceof Array)) {
            onNotFound(response);
            return false;
        }

        // Get avatar
        const avatar: Express.Multer.File | undefined = files.find(
            function (file) {
                return file.fieldname === 'avatar';
            }
        )

        // Not found
        if (!avatar) {
            onNotFound(response);
            return false;
        }

        // Invalid mimetype
        if (avatar.mimetype.split("/")[0] !== 'image') {
            onInvalid(response);
            return false;
        }

        // Success
        onSuccess(avatar, files);
        return true;
    }

    protected getPossibleMappings(
        options: any,
        keys: string[],
        index: number,
        curMapping: any,
        possibleMappings: any[]
    ): void {
        if (index < 0 || index >= keys.length) {
            return;
        }

        for (const option of options[keys[index]]) {
            curMapping[keys[index]] = option;

            if (Object.keys(curMapping).length === keys.length) {
                possibleMappings.push(
                    { ...curMapping }
                );
            }

            this.getPossibleMappings(options, keys, index+1, curMapping, possibleMappings);

            delete curMapping[keys[index]];
        }
    }

    protected async validateMetadata(
        request: Request,
        response: Response,
        onSuccess: (_metadata?: any | undefined) => void,
        onMetadataInvalid: (response: Response) => void = function (response) {
            response.json(
                {
                    success: false,
                    message: "Invalid metadata!",
                    code: "METADATA_INVALID"
                }
            );
        },
        onParsingError: (response: Response, error: any) => void = function (response, error) {
            console.error(error);

            response.json(
                {
                    success: false,
                    message: "Failed to parse metadata!",
                    code: "METADATA_PARSING_FAILED"
                }
            );
        },
        onMappingMissing: (response: Response) => void = function (response) {
            response.json(
                {
                    success: false,
                    message: "Make sure all options mapping have at least size and amount!",
                    code: "MAPPING_MISSING"
                }
            );
        },
        onMappingInvalid: (response: Response) => void = function (response) {
            response.json(
                {
                    success: false,
                    message: "All mappings price and amount must be a number that greater than or equals to 0.",
                    code: "MAPPING_INVALID"
                }
            );
        },
        onMappingDuplicate: (response: Response) => void = function (response) {
            response.json(
                {
                    success: false,
                    message: "Metadata mappings duplicated!",
                    code: "MAPPING_DUPLICATED"
                }
            )
        }
    ): Promise<boolean> {
        // Get metadata string
        const metadataStr: string | undefined = request.body.metadata;

        // Not found
        if (!metadataStr) {
            onSuccess(undefined);
            return true;
        }

        // Parsing
        let metadata: any;
        try {
            metadata = JSON.parse(metadataStr);
        }
        catch (error: any) {
            onParsingError(response, error);
            return false;
        }

        // Validating
        return this.useDomainManager(
            async function (domainManager) {
                return domainManager.validateItemMetadata(
                    {
                        metadata: metadata,
                        onSuccess: function () {
                            onSuccess(metadata);
                        },
                        onWrongFormat: function () {
                            onMetadataInvalid(response);
                        },
                        onMappingMissing: function () {
                            onMappingMissing(response);
                        },
                        onInvalid: function () {
                            onMappingInvalid(response);
                        },

                        onMappingDuplicated: function () {
                            onMappingDuplicate(response);
                        }
                    }
                )
            }
        )
    }

    protected async validateType(
        request: Request,
        response: Response,
        path: any[],
        onSuccess: (_type?: ItemType | undefined) => void,
        onHandlingDBFailed: (response: Response, error: any) => void = function (response, error) {
            console.error(error);

                response.json(
                    {
                        success: false,
                        message: "Failed while handling with DB!",
                        code: "HANDLING_DB_FAILED"
                    }
                );
        },
        onNotExist: (response: Response) => void = function (response) {
            response.json(
                {
                    success: false,
                    message: "Given item type doesn't exist!",
                    code: "TYPE_NOT_EXIST"
                }
            );
        }
    ): Promise<boolean> {
        // Get type id from request
        const typeId: string | undefined = request.body.type;

        // Not given case
        if (!typeId) {
            onSuccess();
            return true;
        }

        // Given case
        // Get type from db
        let type: ItemType | undefined;
        try {
            type = await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.getItemType(typeId, path);
                }
            );
        }
        catch (error: any) {
            // Failed while handling with DB
            onHandlingDBFailed(response, error);
            return false;
        }

        // Not exist
        if (!type) {
            onNotExist(response);
            return false;
        }

        // Success
        onSuccess(type);
        return true;
    }

    protected async validateBrand(
        request: Request,
        response: Response,
        path: any[],
        onSuccess: (_brand?: Brand | undefined) => void,
        onHandlingDBFailed: (response: Response, error: any) => void = function (response, error) {
            console.error(error);

                response.json(
                    {
                        success: false,
                        message: "Failed while handling with DB!",
                        code: "HANDLING_DB_FAILED"
                    }
                );
        },
        onNotFound: (response: Response) => void = function (response) {
            response.json(
                {
                    success: false,
                    message: "Given brand doesn't exist!",
                    code: "BRAND_NOT_FOUND"
                }
            );
        }
    ): Promise<boolean> {
        // Get brand id
        const brandId: string | undefined = request.body.brand;

        // Not given case
        if (!brandId) {
            onSuccess();
            return true;
        }

        // Get brand from db
        let brand: Brand | undefined;
        try {
            brand = await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.getBrand(brandId, path);
                }
            );
        }
        catch (error: any) {
            onHandlingDBFailed(response, error);
            return false;
        }

        // Not found
        if (!brand) {
            onNotFound(response);
            return false;
        }

        // Success
        onSuccess(brand);
        return true;
    }

    protected async writeAvatar(
        response: Response,
        avatar: Express.Multer.File,
        onSuccess: (_avatarPath: string) => void,
        onWritingFailed: (response: Response, error: any) => void = function (response, error) {
            console.error(error);

            response.json(
                {
                    success: false,
                    message: "Failed while writing avatar!",
                    code: "WRITING_AVATAR_FAILED"
                }
            );
        }
    ): Promise<boolean> {
        // Writing
        let avatarPath: string;
        try {
            avatarPath = await this.writeFileNamingByDateTimeController.execute(
                {
                    buffer: avatar.buffer,
                    destination: NewItemController.itemImageStoragePath,
                    extension: avatar.mimetype.split("/")[1]
                }
            );
        }
        catch (error: any) {
            // Writing failed
            onWritingFailed(response, error);
            return false;
        }

        // Success
        onSuccess(avatarPath);
        return true;
    }

    protected async writeImages(
        files: Express.Multer.File[],
        onSuccess: (_imagesPath: string[]) => void,
        onWritingFailed: (error: any) => void = function (error) {
            console.error(error);
        }
    ): Promise<boolean> {
        // Get image files
        const images: Express.Multer.File[] = files.filter(
            function (file) {
                return file.fieldname === 'images'
            }
        );

        // Images path initialization
        const imagesPath: string[] = [];

        // Writing images
        for (const image of images) {
            try {
                imagesPath.push(
                    await this.writeFileNamingByDateTimeController.execute(
                        {
                            destination: NewItemController.itemImageStoragePath,
                            extension: image.mimetype.split("/")[1],
                            buffer: image.buffer
                        }
                    )
                );
            }
            catch (error: any) {
                onWritingFailed(error);
            }
        }

        // Success
        onSuccess(imagesPath);
        return true;
    }

    // Methods:
    public async execute({ request, response }: RestfulControllerParam): Promise<void> {
        // Validate id
        let id: string = null as any;
        if (
            !this.validateId(
                request,
                response,
                function (_id) {
                    id = _id;
                }
            )
        ) {
            return;
        }

        // Validate name
        let name: string = null as any;
        if (
            !this.validateName(
                request, response,
                function (_name: string) {
                    name = _name;
                }
            )
        ) {
            return;
        }

        // Validate description
        let description: string = null as any;
        if (
            !this.validateDescription(
                request, response,
                function (_description) {
                    description = _description;
                }
            )
        ) {
            return;
        }

        // Validate gender
        let gender: boolean = null as any;
        if (
            !this.validateGender(
                request, response,
                function (_gender) {
                    gender = _gender;
                }
            )
        ) {
            return;
        }

        // Validate amount
        let amount: number = null as any;
        if (
            !this.validateAmount(
                request, response,
                function (_amount) {
                    amount = _amount;
                }
            )
        ) {
            return;
        }

        // Validate price
        let price: number = null as any;
        if (
            !this.validatePrice(
                request, response,
                function (_price) {
                    price = _price;
                }
            )
        ) {
            return;
        }

        // Validate avatar
        let files: Express.Multer.File[] = null as any;
        let avatar: Express.Multer.File = null as any;
        if (
            !this.validateAvatar(
                request, response,
                function (_avatar, _files) {
                    avatar = _avatar;
                    files = _files;
                }
            )
        ) {
            return;
        }

        // Validate metadata
        let metadata: any | undefined;
        if (
            !this.validateMetadata(
                request, response,
                function (_metadata) {
                    metadata = _metadata;
                }
            )
        ) {
            return;
        }

        // Path initialization
        const path: any[] = [];

        // Validate type
        let type: ItemType | undefined;
        if (
            !await this.validateType(
                request, response, path,
                function (_type)  {
                    type = _type;
                }
            )
        ) { 
            return;
        }

        // Validate brand
        let brand: Brand | undefined;
        if (
            !await this.validateBrand(
                request, response, path,
                function (_brand) {
                    brand = _brand;
                }
            )
        ){ 
            return;
        }

        // Avatar handling
        let avatarPath: string = null as any;
        if (
            !await this.writeAvatar(
                response, avatar,
                function (_avatarPath) {
                    avatarPath = _avatarPath;
                }
            )
        ) {
            return;
        }

        // Writing images file
        let imagesPath: string[] = null as any;
        if (
            !await this.writeImages(
                files,
                function (_imagesPath) {
                    imagesPath = _imagesPath;
                }
            )
        ) {
            return;
        }

        // Create new item
        const item: Item = new Item();
        item.Amount = amount;
        item.Avatar = avatarPath;
        item.Brand = brand;
        item.Description = description;
        item.Gender = gender;
        item.Id = id;
        item.Metadata = metadata;
        item.Name = name;
        item.Price = price;
        item.Type = type;

        // Saving item
        try {
            await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.insertItem(item);
                }
            );
        }
        catch (error: any) {
            // Deleting image files saved
            for (const imagePath of [ ...imagesPath, avatarPath ]) {
                await this.deleteFileController.execute(imagePath);
            }

            // Responding
            response.json(
                {
                    success: false,
                    message: "Failed while handling with DB!",
                    code: "HANDLING_DB_FAILED"
                }
            );

            console.error(error);
            return;
        }

        // Creating item images
        const itemImages: ItemImage[] = [];
        for (const imagePath of imagesPath) {
            itemImages.push(
                new ItemImage(imagePath, item)
            );
        }

        // Saving item images
        for (const itemImage of itemImages) {
            try {
                await this.useDomainManager(
                    async function (domainManager) {
                        return domainManager.insertItemImage(itemImage);
                    }
                );
            }
            catch (error: any) {
                // Remove corresponding image
                await this.deleteFileController.execute(itemImage.Path as string);

                console.error(error);
            }
        }

        // Responding
        response.json(
            { success: true }
        );
    }
}