import Item from "./Item";

export default class Brand{
    //fields
    private id? : string | undefined;
    private name? : string | undefined;
    private items?: Item[] | undefined; 
    
    
    //constructor
    public constructor(
        id? : string | undefined,
        name? : string | undefined,
        items? : Item[] | undefined

    ){
        this.id = id;
        this.name = name;
        this.items = items;
    }

    //method
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
    public get Items(): Item[] | undefined {
           return this.items;
    }
    
    public set Items(items: Item[] | undefined) {
           this.items = items;
    }

   
 
}