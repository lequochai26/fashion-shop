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

    public async declareWithProvider(
        provider: any,
        name: string,
        dependencies?: [ string, string ][]
    ): Promise<void> {
        // Get params for provider func
        const params: any[] = [];

        for (const paramName of provider.params) {
            if (!this.nodes[paramName]) {
                throw new Error(`Object '${paramName}' doesn't exist in the container!`);
            }

            params.push(this.nodes[paramName].target);
        }

        // Calling provider func with given params and receive target
        const target: any = provider.func(params);

        // Called declare method
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
            if (objectDeclaration.target) {
                await this.declare(
                    objectDeclaration.target,
                    objectDeclaration.name,
                    objectDeclaration.dependencies
                );

                continue;
            }

            if (objectDeclaration.provider) {
                await this.declareWithProvider(
                    objectDeclaration.provider,
                    objectDeclaration.name,
                    objectDeclaration.dependencies
                );

                continue;
            }
            
            if (objectDeclaration.prototype) {
                await this.declareWithPrototype(
                    objectDeclaration.prototype,
                    objectDeclaration.name,
                    objectDeclaration.dependencies
                );

                continue;
            }

            throw new Error(`Object declaration must contains target or provider or prototype, object declaraton with name ${objectDeclaration.name} contains none of them!`);
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