export default class ObjectsContainer {
    // Fields:
    private nodes: { [index: string]: { target: any, dependencies: [ string, string ][] } };

    // Constructor:
    public constructor() {
        this.nodes = {};
    }

    // Methods:
    public async declareWithPrototype(
        prototype: object | null,
        name: string,
        dependencies?: [ string, string ][]
    ): Promise<void> {
        // Check if given name already exist
        if (this.nodes[name]) {
            throw new Error(`Object with name '${name}' already exist!`);
        }

        // Taget initialization
        const target = Object.create(prototype);

        // Call declare method
        return this.declare(target, name, dependencies);
    }

    public async declare(
        target: any,
        name: string,
        dependencies?: [string, string][]
    ): Promise<void> {
        // Setup dependencies for target
        if (dependencies) {
            for (const dependency of dependencies) {
                if (this.nodes[dependency[1]]) {
                    target[dependency[0]] = this.nodes[dependency[1]].target;
                }
            }
        }

        // Setup dependencies for all targets in nodes
        for (const node of Object.values(this.nodes)) {
            for (const dependency of node.dependencies) {
                if (dependency[1] !== name) {
                    continue;
                }

                node.target[dependency[0]] = target;
            }
        }

        // Declaring target into nodes field
        this.nodes[name] = { target: target, dependencies: dependencies || [] };
    }

    public async load(objectsDeclaration: any): Promise<void> {
        for (const objectDeclaration of objectsDeclaration) {
            await this.declareWithPrototype(
                objectDeclaration.prototype,
                objectDeclaration.name,
                objectDeclaration.dependencies
            )
        }
    }

    public retrieve(name: string): any | undefined {
        return this.nodes[name]?.target;
    }

    public retrieveAll(): any[] {
        // Getting all objects in nodes
        const result: any[] = Object.values(this.nodes).map(
            function (node) {
                return node.target;
            }
        );

        // Return result
        return result;
    }
}