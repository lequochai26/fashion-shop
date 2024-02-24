import Item from "./Item";

export default class ItemImage {

    //Fields
    private item?: Item | undefined;
    private path?: string | undefined;
    


    //Constructor
    public constructor(
        path?: string | undefined,
        item?: Item | undefined

    ) {
        this.path = path;
        this.item = item;
    }

    //methods:

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