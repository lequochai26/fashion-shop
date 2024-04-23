import OrderType from "../../enums/OrderType";
import Item from "./Item";
import ItemMetadata, { Mapping } from "../ItemMetadata";
import Order from "./Order";

export default class OrderItem{
    //fields:
    private order?: Order | undefined;
    private item?: Item | undefined;
    private amount?: number | undefined;
    private price?: number | undefined;
    private metadata?: any | undefined;
    public getOrderCallback?: () => Promise<Order | undefined>;
    public getItemCallback?: () => Promise<Item | undefined>;

    //constructor:
    public constructor(
        order?: Order | undefined,
        item?: Item | undefined,
        amount?: number | undefined,
        price?: number | undefined,
        metadata?: any | undefined
    ){
        this.order = order;
        this.item = item;
        this.amount = amount;
        this.price = price;
        this.metadata = metadata;
    }

    // Methods:
    public async getOrder(): Promise<Order | undefined> {
        if (!this.getOrderCallback) {
            return this.order;
        }

        if (!this.order) {
            this.order = await this.getOrderCallback();
        }
        else if ((this.order as any).fromConverter) {
            this.order = await this.getOrderCallback();
        }

        return this.order;
    }

    public async getItem(): Promise<Item | undefined> {
        if (!this.getItemCallback) {
            return this.item;
        }

        if (!this.item) {
            this.item = await this.getItemCallback();
        }
        else if ((this.item as any).fromConverter) {
            this.item = await this.getItemCallback();
        }

        return this.item;
    }

    public async totalPrice(orderType: OrderType): Promise<number> {
        // Get item
        const item = await this.getItem();

        // Check item
        if (!item) {
            throw new Error("item field is missing!");
        }

        // Calculate price
        if (!this.metadata) {
            if (orderType === OrderType.BUY) {
                this.price = (item.BuyPrice as number) * (this.Amount as number);
            }
            else {
                this.price = (item.Price as number) * (this.Amount as number);
            }
        }
        else {
            const itemMetadata: ItemMetadata | undefined = item.Metadata;

            if (!itemMetadata) {
                throw new Error(`Item with id ${item.Id} doesn't have metadata!`);
            }

            const mapping: Mapping | undefined = itemMetadata.getMapping(this.metadata);

            if (!mapping) {
                throw new Error(`Metadata invalid!`);
            }

            if (orderType == OrderType.BUY) {
                this.price = mapping.buyPrice * (this.Amount as number);
            }
            else {
                this.price = mapping.price * (this.Amount as number);
            }
        }

        // Return this's price
        return this.price;
    }

    // Getters / setters:
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

    public get Metadata(): any | undefined {
        return this.metadata;
    }
    public set Metadata(metadata : any | undefined) {
        this.metadata = metadata;
    }
}