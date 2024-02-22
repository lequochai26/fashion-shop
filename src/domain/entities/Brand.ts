export default class Brand{
     //fields
     private id? : string | undefined;
     private name? : string | undefined;
     /* items : Item[]; */
     
 
     //constructor
     public constructor(
         id? : string | undefined,
         name? : string | undefined,
 
     ){
         this.id = id;
         this.name = name;
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
 
}