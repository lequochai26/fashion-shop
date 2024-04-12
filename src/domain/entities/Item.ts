import Brand from "./Brand";
import CartItem from "./CartItem";
import ItemImage from "./ItemImage";
import ItemMetadata from "./ItemMetadata";
import ItemType from "./ItemType";
import OrderItem from "./OrderItem";

export default class Item {
    // Static methods:
    public static createFilterFunc(filter: any, allRequired: boolean): (target: Item) => boolean {
        return function (target: Item): boolean {
            // Gender
            if (filter.gender !== undefined) {
                if (target.Gender !== filter.gender) {
                    if (allRequired) {
                        return false
                    }
                }
                else {
                    if (!allRequired) {
                        return true;
                    }
                }
            }

            // Price
            if (filter.price && typeof filter.price == 'object') {
                if (target.Price as number < filter.price.min && target.Price as number > filter.price.max) {
                    if (allRequired) {
                        return false;
                    }
                }
                else {
                    if (!allRequired) {
                        return true;
                    }
                }
            }

            // Type
            if (filter.type) {
                if (target.Type?.Id !== filter.type) {
                    if (allRequired) {
                        return false;
                    }
                }
                else {
                    if (!allRequired) {
                        return true;
                    }
                }
            }

            // Brand
            if (filter.brand) {
                if (target.Brand?.Id !== filter.brand) {
                    if (allRequired) {
                        return false;
                    }
                }
                else {
                    if (!allRequired) {
                        return true;
                    }
                }
            }

            return allRequired;
        };
    }

    // Fields:
    private id?: string | undefined;
    private avatar?: string | undefined;
    private name?: string | undefined;
    private description?: string | undefined;
    private price?: number | undefined;
    private buyPrice?: number | undefined;
    private amount?: number | undefined;
    private gender?: Boolean | undefined;
    private metadata?: ItemMetadata | undefined;

    //dependency
    private type?: ItemType | undefined;
    private brand?: Brand | undefined;
    private images: ItemImage[];
    private orders: OrderItem[];
    private users: CartItem[];

    // Constructor:
    public constructor(
        id?: string | undefined,
        avatar?: string | undefined,
        name?: string | undefined,
        description?: string | undefined,
        price?: number | undefined,
        buyPrice?: number | undefined,
        amount?: number | undefined,
        gender?: Boolean | undefined,
        metadata?: ItemMetadata | undefined,
        images?: ItemImage[] | undefined,
        orders?: OrderItem[] | undefined,
        users?: CartItem[] | undefined
    ) {
        this.id = id;
        this.avatar = avatar;
        this.name = name;
        this.description = description;
        this.price = price;
        this.buyPrice = buyPrice;
        this.amount = amount;
        this.gender = gender;
        this.metadata = metadata;
        this.images = images||[];
        this.orders = orders||[];
        this.users = users || [];
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
    public get Metadata(): ItemMetadata | undefined{
        return this.metadata;
    }
    public set Metadata(metadata: ItemMetadata | undefined){
        this.metadata = metadata;
    }

    //TYPE
    public get Type(): ItemType | undefined{
        return this.type;
    }
    public set Type(type: ItemType | undefined){
        this.type = type;
    }
    
    //BRAND
    public get Brand(): Brand | undefined{
        return this.brand;
    }
    public set Brand(brand: Brand | undefined){
        this.brand = brand;
    }

    //IMAGES
    public get Images(): ItemImage[]{
        return this.images;
    }
    public set Images(images: ItemImage[] ){
        this.images = images;
    }

    //ORDER
    public get Orders(): OrderItem[] {
        return this.orders;
    }
    public set Orders(orders: OrderItem[]){
        this.orders = orders;
    }

    public get BuyPrice() {
        return this.buyPrice;
    }
    
    public set BuyPrice(value) {
        this.buyPrice = value;
    }

    //User cart item
    public get Users(): CartItem[] {
        return this.users;
    }
    public set Users(value: CartItem[]) {
        this.users = value;
    }
     
}