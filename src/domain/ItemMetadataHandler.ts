import Validator from "./interfaces/Validator";

export type ItemMetadataHandlerParam = {
    metadata: any,
    onSuccess(): void,
    onWrongFormat(): void,
    onMappingMissing(): void,
    onInvalid(): void
}

export default class ItemMetadataHandler implements Validator<ItemMetadataHandlerParam, boolean> {
    // Constructor:
    public constructor() {

    }

    // Methods:
    public checkFormat(metadata: any): boolean {
        // OPTIONS OR MAPPINGS NOT EXISTS
        if (!metadata.options || !metadata.mappings) {
            return false;
        }

        // OPTIONS
        if (typeof metadata.options !== 'object') {
            return false;
        }

        for (const option of metadata.options) {
            if (!(option instanceof Array)) {
                return false;
            }

            for (const element of option) {
                if (typeof element !== 'string') {
                    return false;
                }
            }
        }

        // MAPPINGS
        if (!(metadata.mappings instanceof Array)) {
            return false;
        }

        for (const mapping of metadata.mappings) {
            if (typeof mapping !== 'object') {
                return false;
            }

            if (!mapping.price || !mapping.amount) {
                return false;
            }

            // Price or amount not number
            if (typeof mapping.price !== 'string' || typeof mapping.amount !== 'string') {
                return false;
            }
        }

        // Success
        return true;
    }

    public getPossibleMappings(metadata: any): any[] {
        // Local function:
        function getAllPossibleMappings(
            options: any,
            keys: string[],
            possibleMappings: any[],
            curMapping: any = {},
            index: number = 0,
        ): void {
            // Exit if index greater than or equals to keys's length
            if (index >= keys.length) {
                return;
            }

            // Query all elements of option with key at current index
            for (const element of options[keys[index]]) {
                curMapping[keys[index]] = element;

                if (Object.keys(curMapping).length >= keys.length) {
                    possibleMappings.push({ ...curMapping });
                }

                getAllPossibleMappings(options, keys, possibleMappings, curMapping, index+1);
            }

            // Delete element of current key of index from curMapping
            delete curMapping[keys[index]];
        }

        // Result initialization
        const result: any[] = [];

        // Getting all possible mappings
        getAllPossibleMappings(
            metadata.options,
            Object.keys(metadata.options),
            result
        );

        // Return result
        return result;
    }

    public checkNoMappingMissing(metadata: any): boolean {
        // Get possible mappings of this metadata
        const possibleMappings: any[] = this.getPossibleMappings(metadata);

        // Check if any possible mapping is missing
        for (const possibleMapping of possibleMappings) {
            let found: boolean = false;

            for (const mapping of metadata.mappings) {
                let equals: boolean = true;

                for (const key of Object.keys(possibleMapping)) {
                    if (possibleMapping[key] !== mapping[key]) {
                        equals = false;
                        break;
                    }
                }

                if (equals) {
                    found = true;
                }
            }

            if (!found) {
                return false;
            }
        }

        // Success
        return true;
    }

    public validate({ metadata, onInvalid, onMappingMissing, onSuccess, onWrongFormat }: ItemMetadataHandlerParam): boolean {
        // Check format
        if (!this.checkFormat(metadata)) {
            onWrongFormat();
            return false;
        }

        // Check no mapping missing
        if (!this.checkNoMappingMissing(metadata)) {
            onMappingMissing();
            return false;
        }

        // Check all mappings from metadata valid
        for (let i = 0; i<metadata.mappings.length; i++) {
            // Get current mapping
            const mapping = metadata.mappings[i];

            // Check and make sure mapping's price and amount are valid
            if (mapping.price < 0 || mapping.amount < 0) {
                onInvalid();
                return false;
            }

            // Check and make sure mapping no duplicate
            for (let j = i+1; j<metadata.mappings.length; j++) {
                let equals: boolean = true;

                for (const key of Object.keys(metadata.options)) {
                    if (mapping[key] !== metadata.mappings[key]) {
                        equals = false;
                        break;
                    }
                }
                
                // Mapping duplicated
                if (equals) {
                    onInvalid();
                    return false;
                }
            }
        }

        // Valid
        onSuccess();
        return true;
    }
}