import OrderItem from "./OrderItem";
import User from "./User";

export default class Order {
    // Fields:
    private id?: string | undefined;
    private type?: string | undefined;
    private date?: Date | undefined;
    private totalPrice?: number | undefined;
    private metadata?: string | undefined;
    private createBy:User | undefined;
    private orderBy:User | undefined;
    private items: OrderItem[] | undefined
    

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
        return this.id;
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

    //CREATEBY
    public get CreateBy(): User | undefined{
        return this.createBy;
    }
    public set CreateBy(createBy: User | undefined){
        this.createBy = createBy;
    }

    //ORDERBY
    public get OrderBy(): User | undefined{
        return this.orderBy;
    }
    public set OrderBy(orderBy: User | undefined){
        this.orderBy = orderBy;
    }

    //ITEMS
    public get Items(): OrderItem[] | undefined{
        return this.items;
    }
    public set Items(items: OrderItem[] | undefined){
        this.items = items;
    }
}