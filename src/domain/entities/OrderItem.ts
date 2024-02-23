import Item from "./Item";
import Order from "./Order";

export default class OrderItem{
    //fields:
    private order?: Order | undefined;
    private item?: Item | undefined;
    private amount?: number | undefined;
    private price?: number | undefined;
    private metadata?: string | undefined;

    //constructor:
    public constructor(
        order?: Order | undefined,
        item?: Item | undefined,
        amount?: number | undefined,
        price?: number | undefined,
        metadata?: string | undefined
    ){
        this.order = order;
        this.item = item;
        this.amount = amount;
        this.price = price;
        this.metadata = metadata;
    }

    //methods:
    public get Order(): Order | undefined {
        return this.order;
    }
    public set Order(order : Order | undefined) {
        this.order = order;
    }

    public get Item(): Item | undefined {
        return this.item;
    }
    public set Item(item: Item | undefined) {
        this.item = item;
    }

    public get Amount(): number | undefined {
        return this.amount;
    }
    public set Amount(amount : number | undefined) {
        this.amount = amount;
    }

    public get Price(): number | undefined {
        return this.price;
    }
    public set Price(price: number | undefined) {
        this.price = price;
    }

    public get Metadata(): string | undefined {
        return this.metadata;
    }
    public set Metadata(metadata : string | undefined) {
        this.metadata = metadata;
    }
}