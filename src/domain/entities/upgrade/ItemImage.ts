import Item from "./Item";

export default class ItemImage {

    //Fields
    private item?: Item | undefined;
    private path?: string | undefined;
    private getItemCallback?: () => Promise<Item | undefined>;

    //Constructor
    public constructor(
        path?: string | undefined,
        item?: Item | undefined

    ) {
        this.path = path;
        this.item = item;
    }

    //methods:
    public async getItem(): Promise<Item | undefined> {
        if (!this.getItemCallback) {
            return this.item;
        }

        if (!this.item) {
            this.item = await this.getItemCallback();
        }
        else if ((this.item as any).fromConverter) {
            this.item = await this.getItemCallback();
        }

        return this.item;
    }

    public get Item(): Item | undefined {
        return this.item;
    }

    public set Item(item: Item | undefined){
        this.item = item;
    }

    public get  Path(): string | undefined {
        return this.path;
    }

    public set Path(path: string | undefined){
        this.path = path;
    }
}