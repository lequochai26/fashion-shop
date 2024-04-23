import CartItem from "./CartItem";
import Order from "./Order";
import VerificationCode from "../VerificationCode";

export default class User {
    //fields:
    private email?: string | undefined;
    private password?: string | undefined;
    private fullName?: string | undefined;
    private gender?: boolean | undefined;
    private phoneNumber?: string | undefined;
    private address?: string | undefined;
    private avatar? : string | undefined;
    private permission?: string | undefined;
    private wallet?: string | undefined;

    //dependency:
    private orderedOrders: Order[];
    private createdOrders: Order[];
    private cart: CartItem[];
    private verificationCode : VerificationCode[];

    public getOrderedOrdersCallback?: () => Promise<Order[]>;
    public getCreatedOrdersCallback?: () => Promise<Order[]>;
    public getCartCallback?: () => Promise<CartItem[]>;

    //constructor:
    public constructor(
        email?: string | undefined,
        password?: string | undefined,
        fullName?: string | undefined,
        gender?: boolean | undefined,
        phoneNumber?: string | undefined,
        address?: string | undefined,
        avatar? : string | undefined,
        permission?: string | undefined,
        orderedOrders?: Order[] | undefined,
        createdOrders?: Order[] | undefined,
        cart?: CartItem[] | undefined,
        verificationCode? : VerificationCode[] | undefined,
        wallet?: string | undefined
    ) {
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.gender = gender;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.avatar = avatar;
        this.permission = permission;
        this.orderedOrders = orderedOrders || [];
        this.createdOrders = createdOrders || [];
        this.cart = cart || [];
        this.verificationCode = verificationCode || [];
        this.wallet = wallet;
    }

    //methods:
    public async getOrderedOrder(id: string): Promise<Order | undefined> {
        return (await this.getOrderedOrders()).filter(
            order => order.Id === id
        )[0];
    }

    // Methods:
    public async getOrderedOrders(): Promise<Order[]> {
        if (this.orderedOrders.length < 1 && this.getOrderedOrdersCallback) {
            this.orderedOrders = await this.getOrderedOrdersCallback();
        }
        return this.orderedOrders;
    }

    public async getCreatedOrders(): Promise<Order[]> {
        if (this.createdOrders.length < 1 && this.getCreatedOrdersCallback) {
            this.createdOrders = await this.getCreatedOrdersCallback();
        }
        return this.createdOrders;
    }

    public async getCart(): Promise<CartItem[]> {
        if (this.cart.length < 1 && this.getCartCallback) {
            this.cart = await this.getCartCallback();
        }
        return this.cart;
    }

    // Getters / setters:
    public get Email(): string | undefined {
        return this.email;
    }
    public set Email(email: string | undefined) {
        this.email = email;
    }
    
    public get Password(): string | undefined {
        return this.password;
    }
    public set Password(password : string | undefined) {
        this.password = password;
    }

    public get FullName(): string | undefined {
        return this.fullName;
    }
    public set FullName(fullName: string | undefined) {
        this.fullName = fullName;
    }

    public get Gender(): boolean | undefined {  
        return this.gender;
    }
    public set Gender(gender: boolean | undefined) {
        this.gender = gender;
    }

    public get PhoneNumber(): string | undefined {
        return this.phoneNumber;
    }
    public set PhoneNumber(phoneNumber : string | undefined) {
        this.phoneNumber = phoneNumber;
    }

    public get Adress(): string | undefined {
        return this. address;
    }
    public set Adress(address : string | undefined) {
        this.address = address;
    }

    public get Avatar(): string | undefined {
        return this.avatar;
    }
    public set Avatar(avatar : string | undefined) {
        this.avatar = avatar;
    }

    public get Permission() : string | undefined {
        return this.permission;
    }
    public set Permission(permission : string | undefined) {
        this.permission = permission;
    }

    public get OrderedOrders() : Order[] {
        return this.orderedOrders;
    }
    public set OrderedOrders(orderedOrders : Order[] ) {
        this.orderedOrders = orderedOrders;
    }

    public get CreatedOrders(): Order[]  {
        return this.createdOrders;
    }
    public set CreatedOrders(createdOrders: Order[] ) {
        this.createdOrders = createdOrders;
    }

    public get Cart() : CartItem[]  {
        return this.cart;
    }
    public set Cart(cart : CartItem[] ) {
        this.cart = cart;
    }

    public get VerificationCode() : VerificationCode[] {
        return this.verificationCode;
    }
    public set VerificationCode(verificationCode : VerificationCode[] ) {
        this.verificationCode = verificationCode;
    }

    public get Wallet() {
        return this.wallet;
    }
    public set Wallet(value) {
        this.wallet = value;
    }
}