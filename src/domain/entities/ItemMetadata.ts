// Types:
export type Option = string[];
export type Mapping = { [ index: string ]: any, price: number, amount: number };

export default class ItemMetadata {
    // Fields:
    private options: { [ index: string ]: Option };
    private mappings: Mapping[];

    // Constructors:
    public constructor(metadata: any) {
        this.options = metadata.options;
        this.mappings = metadata.mappings;
    }

    // Methods:
    public getMapping(filter: any): Mapping | undefined {
        // Get keys
        const keys = Object.keys(filter);

        // Getting
        let target: Mapping | undefined = undefined;

        for (const mapping of this.mappings) {
            let match: boolean = true;

            for (const key of keys) {
                if (mapping[key] === filter[key]) {
                    continue;
                }
                match = false;
                break;
            }

            if (match) {
                target = mapping;
                break;
            }
        }

        // Return
        return target;
    }

    public toJSON() {
        const self = this;

        return {
            options: self.options,
            mappings: self.mappings
        };
    }

    // Getters / setters:
    public get Options() {
        return this.options;
    }

    public set Options(value) {
        this.options = value;
    }

    public get Mappings() {
        return this.mappings;
    }

    public set Mappings(value) {
        this.mappings = value;
    }
}