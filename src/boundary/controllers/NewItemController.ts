import DomainManager from "../../domain/DomainManager";
import RestfulController from "./abstracts/RestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";

export default class NewItemController extends RestfulController {
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
                    message: "id parameter is required!"
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
                    message: "name parameter is required!"
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
                    message: "description parameter is required!"
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
                    message: "gender parameter is required!"
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
                    message: "amount parameter is required!"
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
                    message: "amount must be a number that greater than or equals to 0."
                }
            );
            return;
        }

        if (amount < 0) {
            response.json(
                {
                    success: false,
                    message: "amount must be a number that greater than or equals to 0."
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
                    message: "Item's avatar is required!"
                }
            );
            return;
        }

        if (!(files instanceof Array)) {
            response.json(
                {
                    success: false,
                    message: "Item's avatar is required!"
                }
            );
            return;
        }

        const avatar = files.find(
            function (file) {
                if (file.fieldname === "avatar") {
                    return true;
                }
            }
        );

        if (!avatar) {
            response.json(
                {
                    success: false,
                    message: "Item's avatar is required!"
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
            
        }
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