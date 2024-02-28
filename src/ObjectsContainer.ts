export default class ObjectsContainer {
    // Fields:
    private nodes: { [index: string]: { target: any, dependencies: [ string, string ][] } };

    // Constructor:
    public constructor() {
        this.nodes = {};
    }

    // Methods:
    public async declare(
        prototype: object | null,
        name: string,
        dependencies?: [ string, string ][]
    ): Promise<void> {
        // Check if given name already exist
        if (this.nodes[name]) {
            throw new Error(`Object with name '${name}' already exist!`);
        }

        // Create new object base on given prototype
        const target = Object.create(prototype);

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

    public retrieve(name: string): any | undefined {
        return this.nodes[name]?.target;
    }
}