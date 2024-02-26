import OrderItem from "./OrderItem";
import User from "./User";

export default class Order {
    // Fields:
    private id?: string | undefined;
    private type?: string | undefined;
    private date?: Date | undefined;
    private totalPrice?: number | undefined;
    private metadata?: string | undefined;
    private createdBy?:User | undefined;
    private orderedBy?:User | undefined;
    private items: OrderItem[];
    

    // Constructor:
    public constructor(
        id?: string | undefined,
        type?: string | undefined,
        date?: Date | undefined,
        totalPrice?: number | undefined,
        metadata?: string | undefined,
        items?: OrderItem[] | undefined,
        createdBy?:User | undefined,
        orderedBy?:User | undefined,
    ) {
        this.id = id;
        this.type = type;
        this.date = date;
        this.totalPrice = totalPrice;
        this.metadata= metadata;
        this.items = items || [];
        this.createdBy=createdBy;
        this.orderedBy=orderedBy;
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
    public get CreatedBy(): User | undefined{
        return this.createdBy;
    }
    public set CreatedBy(createdBy: User | undefined){
        this.createdBy = createdBy;
    }

    //ORDERBY
    public get OrderedBy(): User | undefined{
        return this.orderedBy;
    }
    public set OrderedBy(orderedBy: User | undefined){
        this.orderedBy = orderedBy;
    }

    //ITEMS
    public get Items(): OrderItem[]{
        return this.items;
    }
    public set Items(items: OrderItem[]){
        this.items = items;
    }
}