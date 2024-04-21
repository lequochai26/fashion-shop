import OrderType from "../../enums/OrderType";
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
    private status?: string | undefined;
    private paymentMethod?: string | undefined;
    public getCreatedByCallback?: () => Promise<User | undefined>;
    public getOrderedByCallback?: () => Promise<User | undefined>;
    public getItemsCallback?: () => Promise<OrderItem[]>;

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
        status?: string | undefined,
        paymentMethod?: string | undefined
    ) {
        this.id = id;
        this.type = type;
        this.date = date;
        this.totalPrice = totalPrice;
        this.metadata= metadata;
        this.items = items || [];
        this.createdBy=createdBy;
        this.orderedBy=orderedBy;
        this.status = status;
        this.paymentMethod = paymentMethod;
    }

    // Methods:
    public async getCreatedBy(): Promise<User | undefined> {
        if (!this.getCreatedByCallback) {
            return this.createdBy;
        }

        if (!this.createdBy) {
            this.createdBy = await this.getCreatedByCallback();
        }
        else if ((this.createdBy as any).fromConverter) {
            this.createdBy = await this.getCreatedByCallback();
        }

        return this.createdBy;
    }

    public async getOrderedBy(): Promise<User | undefined> {
        if (!this.getOrderedByCallback) {
            return this.orderedBy;
        }

        if (!this.orderedBy) {
            this.orderedBy = await this.getOrderedByCallback();
        }
        else if ((this.orderedBy as any).fromConverter) {
            this.orderedBy = await this.getOrderedByCallback();
        }

        return this.orderedBy;
    }

    public async getItems(): Promise<OrderItem[]> {
        if (this.items.length < 1 && this.getItemsCallback) {
            this.items = await this.getItemsCallback();
        }

        return this.items;
    }

    public autoId(): string {
        this.id = new Date()
            .getTime()
            .toString();

        return this.id;
    }

    public calcTotalPrice(orderType: OrderType): number {
        this.totalPrice = 0;
        for (const item of this.items) {
            this.totalPrice += item.totalPrice(orderType);
        }
        return this.totalPrice;
    }

    // Getters / setters:
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
    public get Metadata(): string | undefined{
        return this.metadata;
    }
    public set Metadata(metadata: string | undefined){
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

    public get Status() {
        return this.status;
    }
    public set Status(value) {
        this.status = value;
    }

    public get PaymentMethod() {
        return this.paymentMethod;
    }
    public set PaymentMethod(value) {
        this.paymentMethod = value;
    }
}