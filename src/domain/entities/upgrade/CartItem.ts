import Item from "./Item";
import User from "./User";

export default class CartItem {
    //Fields
    private user?: User | undefined;
    private item?: Item | undefined;
    private amount?: number | undefined;
    private metadata?: any | undefined;
    private getUserCallback?: () => Promise<User | undefined>;
    private getItemCallback?: () => Promise<Item | undefined>;

    //Constructor
    public constructor(
        user?: User | undefined,
        item?: Item | undefined, 
        amount?: number | undefined,
        metadata?: any | undefined
    ) {
        this.user = user;
        this.item= item;
        this.amount = amount;
        this.metadata = metadata;
    }

    //methods:
    public async getUser(): Promise<User | undefined> {
        if (!this.getUserCallback) {
            return this.user;
        }

        if (!this.user) {
            this.user = await this.getUserCallback();
        }
        else if ((this.user as any).fromConverter) {
            this.user = await this.getUserCallback();
        }

        return this.user;
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

    public get User(): User | undefined{
        return this.user;
    }
    public set User(user: User | undefined ){
        this.user = user;
    }

    public get Item(): Item | undefined{
        return this.item;
    }
    
    public set Item(item: Item | undefined){
        this.item = item;
    }

    public get Amount(): number | undefined{
        return this.amount;
    }
    public set Amount(amount: number | undefined ){
        this.amount = amount;
    }

    public get Metadata(): any | undefined{
        return this.metadata;
    }
    public set Metadata(metadata: any | undefined ){
        this.metadata = metadata;
    }
}