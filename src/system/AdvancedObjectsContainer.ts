import ObjectsContainer from "./ObjectsContainer";

export default class AdvancedObjectsContainer extends ObjectsContainer {
    // Fields:
    protected needs: { [index: string]: string[] };

    // Constructor:
    public constructor() {
        super();

        this.needs = {};
    }

    // Methods:
    public async declare(target: any, name: string, dependencies?: [string, string][] | undefined): Promise<void> {
        if (this.nodes[name]) {
            throw new Error(`Object with name ${name} already exist!`);
        }

        if (dependencies) {
            for (const [ fieldName, references ] of dependencies) {
                if (this.nodes[references]) {
                    target[fieldName] = this.nodes[references].target;
                }
                else {
                    if (!this.needs[references]) {
                        this.needs[references] = [];
                    }

                    this.needs[references].push(name);
                }
            }
        }

        if (this.needs[name]) {
            for (const need of this.needs[name]) {
                this.nodes[need].target[name] = target;
                this.needs[name].slice(
                    this.needs[name].indexOf(need)
                );
            }
        }

        // Declaring
        this.nodes[name] = { target: target, dependencies: dependencies || [] };
    }
}