export default class CartItem {
    //Fields
    private amount?: number | undefined;
    private metadata?: any | undefined;

    //Constructor
    public constructor(
        amount?: number | undefined,
        metadata?: any | undefined
    ) {
        this.amount = amount;
        this.metadata = metadata;
    }

    //methods:
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