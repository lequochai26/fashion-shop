export default class ItemImage {

    //Fields
    //private item?
    private path?: string | undefined;


    //Constructor
    public constructor(
        path?: string | undefined
    ) {
        this.path = path;
    }

    //methods:
    public get  Path(): string | undefined {
        return this.path;
    }

    public set Path(path: string | undefined){
        this.Path = path;
    }
}