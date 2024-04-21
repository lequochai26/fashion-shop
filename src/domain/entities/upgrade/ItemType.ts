import Item from "./Item";


export default class ItemType{
    //fields
    private id? : string | undefined;
    private name? : string | undefined;
    private items: Item[];
    public getItemsCallback?: () => Promise<Item[]>;
    
    //constructor
    public constructor(
        id? : string | undefined,
        name? : string | undefined,
        items? : Item[] | undefined
    ){
        this.id = id;
        this.name = name;
        this.items = items || [];
    }

    //method
    public async getItems(): Promise<Item[]> {
        if (this.items.length < 1 && this.getItemsCallback) {
            this.items = await this.getItemsCallback();
        }
        return this.items;
    }

    //id
    public get Id(): string | undefined{
        return this.id;
    }
    
    public set Id(id: string | undefined){
        this.id = id;
    }
    //name
    public get Name(): string | undefined{
        return this.name;
       }
       
       public set Name(name: string | undefined){
           this.name = name;
       }
    //item
    public get Items(): Item[] {
           return this.items;
    }
    
    public set Items(items: Item[]) {
           this.items = items;
    }

   
 

}