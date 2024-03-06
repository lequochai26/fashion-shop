import DomainManager from "../../domain/DomainManager";
import Brand from "../../domain/entities/Brand";
import ItemType from "../../domain/entities/ItemType";
import UpdateItemRestfulController from "./abstracts/UpdateItemRestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";

export default class NewItemController extends UpdateItemRestfulController {
    // Constructor:
    public constructor(domainManager?: DomainManager | undefined) {
        super(domainManager);
    }

    // Methods:
    public async execute({ request, response }: RestfulControllerParam): Promise<void> {
        // Get id
        const id: string | undefined = request.body.id;

        // ID not given case
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

        // Get name
        const name: string | undefined = request.body.name;

        // Name not given case
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

        // Get description
        const description: string | undefined = request.body.description;

        // Description not given case
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

        // Get gender
        const genderStr: string | undefined = request.body.gender;

        // Gender not given case
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

        // Parse gender string to boolean gender
        const gender: boolean = genderStr === 'true';

        // Get amount
        const amountStr: string | undefined = request.body.amount;

        // Amount not given case
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
            amount = Number.parseFloat(amountStr);
        }
        catch (error: any) {
            console.error(error);

            response.json(
                {
                    success: false,
                    message: "amount must be a number that greater than or equals to 0.",
                    code: "AMOUNT_INVALID"
                }
            );
            return;
        }

        // Amount lower than 0 case
        if (amount < 0) {
            response.json(
                {
                    success: false,
                    message: "amount must be a number that greater than or equals to 0.",
                    code: "AMOUNT_INVALID"
                }
            );
            return;
        }

        // Get price
        const priceStr: string | undefined = request.body.price;

        // Price not given case
        if (!priceStr) {
            response.json(
                {
                    success: false,
                    message: "price parameter is reuqired!",
                    code: "PRICE_REQUIRED"
                }
            );
            return;
        }

        // Parsing price into number
        let price: number;
        try {
            price = Number.parseFloat(priceStr);
        }
        catch (error: any) {
            console.error(error);

            response.json(
                {
                    success: false,
                    message: "price must be a number that greater than or equals to 0.",
                    code: "PRICE_INVALID"
                }
            );

            return;
        }

        // Price lower than 0 case
        if (price < 0) {
            response.json(
                {
                    success: false,
                    message: "price must be a number that greater than or equals to 0.",
                    code: "PRICE_INVALID"
                }
            );

            return;
        }

        // Get uploaded files from request
        const files = request.files;

        // No files found case
        if (!files) {
            response.json(
                {
                    success: false,
                    message: "Item's avatar is required!",
                    code: "AVATAR_REQUIRED"
                }
            );
            return;
        }

        if (!(files instanceof Array)) {
            response.json(
                {
                    success: false,
                    message: "Item's avatar is required!",
                    code: "AVATAR_REQUIRED"
                }
            );
            return;
        }

        // Get avatar
        const avatar = files.find(
            function (file) {
                if (file.fieldname === "avatar") {
                    return true;
                }
            }
        );

        // Avatar not given case
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

        // Get avatar's mime
        const avatarMimeType: string[] = avatar.mimetype.split("/");

        // Invalid avatar's file type
        if (avatarMimeType[0] !== "image") {
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

        // Have metadata case
        let metadata: any | undefined = undefined;
        if (metadataStr) {
            // Parsing metadata
            try {
                metadata = JSON.parse(metadataStr);
            }
            catch (error: any) {
                console.error(error);

                response.json(
                    {
                        success: false,
                        message: "Failed to parse metadata!"
                    }
                );

                return;
            }

            // Get keys of metadata and remove 'mappings' key
            const keys: string[] = Object.keys(metadata)
            .filter(
                function (key) {
                    return key !== "mappings";
                }
            );

            // Get possible mappings
            const possibleMappings: any[] = [];
            this.getPossibleMappings(metadata, keys, 0, {}, possibleMappings);
            
            // Check all possible mappings
            for (const possibleMapping of possibleMappings) {
                // Get corresponding mapping from metadata
                const mapping: any | undefined = metadata.mappings.find(
                    function (mapping: any) {
                        for (const key of Object.keys(possibleMapping)) {
                            if (possibleMapping[key] !== mapping[key]) {
                                return false;
                            }
                        }

                        return true;
                    }
                );

                // Mapping doesn't exist case
                if (!mapping) {
                    response.json(
                        {
                            success: false,
                            message: "Make sure all options mapping have at least size and amount!",
                            code: "MAPPING_MISSING"
                        }
                    );
                    return;
                }

                // Check and make sure mapping's price and amount field
                if (!mapping.price || !mapping.amount) {
                    response.json(
                        {
                            success: false,
                            message: "Make sure all options mapping have at least size and amount!",
                            code: "MAPPING_MISSING"
                        }
                    );
                    return;
                }

                // Check and make sure mapping's price and mount field valid
                if (typeof mapping.price !== "number" || typeof mapping.amount !== "number") {
                    response.json(
                        {
                            success: false,
                            message: "All mappings price and amount must be a number that greater than or equals to 0.",
                            code: "MAPPING_INVALID"
                        }
                    );
                    return;
                }

                if (mapping.price < 0 || mapping.amount < 0) {
                    response.json(
                        {
                            success: false,
                            message: "All mappings price and amount must be a number that greater than or equals to 0.",
                            code: "MAPPING_INVALID"
                        }
                    );
                    return;
                }
            }
        }

        // Path initialization
        const path: any[] = [];

        // Get type
        const typeId: string | undefined = request.body.type;

        // Given type case
        let type: ItemType | undefined;
        if (typeId) {
            // Get type from db
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

            // Type not found case
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

        // Get brand
        const brandId: string | undefined = request.body.brand;

        // Brand given case
        let brand: Brand | undefined;
        if (brandId) {
            // Get brand from db
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

            // Brand not found case
            if (!brand) {
                response.json(
                    {
                        success: false,
                        message: "Given brand doesn't exist!",
                        code: "BRAND_NOT_FOUND"
                    }
                );

                return;
            }
        }

        // Avatar handling
        let avatarPath: string;
        try {
            avatarPath = await this.writeFileNamingByDateTimeController.execute(
                {
                    destination: "./assets",
                    extension: avatar.mimetype.split("/")[1],
                    buffer: avatar.buffer
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

        // 
    }

    private getPossibleMappings(
        metadata: any,
        keys: string[],
        index: number,
        curMapping: any,
        possibleMappings: any[]
    ): void {
        if (index < 0 || index >= keys.length) {
            return;
        }

        for (const option of metadata[keys[index]]) {
            curMapping[keys[index]] = option;

            if (Object.keys(curMapping).length === keys.length) {
                possibleMappings.push(
                    { ...curMapping }
                );
            }

            this.getPossibleMappings(metadata, keys, index+1, curMapping, possibleMappings);

            delete curMapping[keys[index]];
        }
    }
}