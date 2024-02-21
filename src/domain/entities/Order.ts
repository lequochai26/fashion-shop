export default class VerificationCode {
    // Fields:
    private id?: string | undefined;
    private type?: string | undefined;
    private date?: Date | undefined;
    private totalPrice?: number | undefined;
    private metadata?: string | undefined;
    /*
        private createBy:User | undefined;
        private orderBy:User | undefined:
        items: OrderItem[]
    */

    // Constructor:
    public constructor(
        id?: string | undefined,
        type?: string | undefined,
        date?: Date | undefined,
        totalPrice?: number | undefined,
        metadata?: string | undefined,
    ) {
        this.id = id;
        this.type = type;
        this.date = date;
        this.totalPrice = totalPrice;
        this.metadata= metadata;
    }

    // Methods:
    //ID
    public get Id(): string | undefined {
        return this.Id;
    }
    public set Id(id: string | undefined) {
        this.id = id;
    }

    //TYPE
    public get Type(): string | undefined {
        return this.type;
    }
    public set Type(type: string | undefined) {
        this.type = type;
    }

    //DATE
    public get Date(): Date | undefined {
        return this.date;
    }
    public set Date(date: Date | undefined) {
        this.date = date;
    }
    
    //TOTALPRICE    
    public get TotalPrice(): number | undefined{
        return this.totalPrice;
    }

    public set TotalPrice(totalPrice: number | undefined) {
        this.totalPrice = totalPrice;
    }

    //METADATA  
    public get MetaData(): string | undefined{
        return this.metadata;
    }
    public set MetaData(metadata: string | undefined){
        this.metadata = metadata;
    }
}