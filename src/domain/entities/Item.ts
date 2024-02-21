export default class Item {
    // Fields:
    private id?: string | undefined;
    private avatar?: string | undefined;
    private name?: string | undefined;
    private description?: string | undefined;
    private price?: number | undefined;
    private amount?: number | undefined;
    private gender?: Boolean | undefined;
    private metadata?: string | undefined;
    /*
        private type?: ItemType | undefined;
        private brand?: Brand | undefined;
        private images: Itemimage[];
        private orders: OrderItem[];
    */
    

    // Constructor:
    public constructor(
        id?: string | undefined,
        avatar?: string | undefined,
        name?: string | undefined,
        description?: string | undefined,
        price?: number | undefined,
        amount?: number | undefined,
        gender?: Boolean | undefined,
        metadata?: string | undefined,
    ) {
        this.id = id;
        this.avatar = avatar;
        this.name = name;
        this.description = description;
        this.price = price;
        this.amount = amount;
        this.gender = gender;
        this.metadata= metadata;
    }

    // Methods:
    //ID
    public get Id(): string | undefined {
        return this.id;
    }
    public set Id(id: string | undefined) {
        this.id = id;
    }

    //AVATAR
    public get Avatar(): string | undefined {
        return this.avatar;
    }
    public set Avatar(avatar: string | undefined) {
        this.avatar = avatar;
    }

    //NAME
    public get Name(): string | undefined {
        return this.name;
    }
    public set Name(name: string | undefined) {
        this.name = name;
    }
    
    //DESCRIPTION    
    public get Description(): string | undefined{
        return this.description;
    }
    public set Description(description: string | undefined) {
        this.description = description;
    }


    //PRICE
    public get Price(): number | undefined{
        return this.price;
    }
    public set Price(price: number | undefined) {
        this.price = price;
    }

    //AMOUNT
    public get Amount(): number | undefined{
        return this.amount;
    }
    public set Amount(amount: number | undefined) {
        this.amount = amount;
    }

    //GENDER
    public get Gender(): Boolean | undefined{
        return this.gender;
    }
    public set Gender(gender: Boolean | undefined) {
        this.gender = gender;
    }

    //METADATA  
    public get MetaData(): string | undefined{
        return this.metadata;
    }
    public set MetaData(metadata: string | undefined){
        this.metadata = metadata;
    }

    /*
    //BRAND
    public get Brand(): Brand | undefined{
        return this.brand;
    }
    public set Brand(brand: Brand | undefined){
        this.brand = brand;
    }

    //IMAGES
    //ORDER
     */
}