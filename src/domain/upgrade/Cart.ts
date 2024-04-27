import DomainManager from "./DomainManager";
import CartItem from "../entities/upgrade/CartItem";
import User from "../entities/upgrade/User";

export default class Cart {
    // Static fields:
    public static CARTITEM_NOT_FOUND: number = 1;

    // Fields:
    private user?: User | undefined;
    private items: SessionCartItem[];
    private domainManager: DomainManager;

    // Constructors:
    public constructor(domainManager: DomainManager, user?: User | undefined) {
        this.user = user;
        this.items = [];
        this.domainManager = domainManager;
    }

    // Methods:
    public async addItem(id: string, amount: number, path: any[], metadata?: any | undefined): Promise<void> {
        // No user case
        if (!this.user) {
            return this.addLocalItem(id, amount, metadata);
        }
        // Have user case
        else {
            return this.addUserCartItem(id, amount, path, metadata);
        }
    }

    public async removeItem(id: string, path: any[], amount?: number | undefined, metadata?: any | undefined): Promise<void> {
        // No user case
        if (!this.user) {
            return this.removeLocalItem(id, amount, metadata);
        }
        // Have user case
        else {
            return this.removeUserCartItem(id, path, amount, metadata);
        }
    }

    public async get(path: any[]): Promise<CartItem[]> {
        if (this.user) {
            return this.user.getCart();
        }
        else {
            const cartItems: CartItem[] = [];

            for (const { id, amount, metadata } of this.items) {
                const cartItem: CartItem = new CartItem();
                cartItem.Item = await this.domainManager.getItem(id, path);
                cartItem.Amount = amount;
                cartItem.Metadata = metadata;
                cartItems.push(cartItem);
            }

            return cartItems;
        }
    }

    public async attach(user: User, path: any[]): Promise<void> {
        // Assign user to this cart
        this.user = user;

        // Converting to local cart to db cart
        for (const { id, amount, metadata } of this.items) {
            await this.addUserCartItem(id, amount, path, metadata);
        }
    }

    public async clear(): Promise<void> {
        // Has user case
        if (this.user) {
            return this.clearUserCart();
        }
        // No user case
        else {
            return this.clearLocalCart();
        }
    }

    public async contains(id: string, metadata?: any): Promise<boolean> {
        if (this.user) {
            return await this.getUserCartItem(id, metadata) !== undefined;
        }
        else {
            return this.getLocalItem(id, metadata) !== undefined;
        }
    }

    public async attachItem(target: Cart, path: any[], id: string, metadata?: any): Promise<void> {
        // User cart case
        if (this.user) {
            return this.attachUserCartItem(target, path, id, metadata);
        }
        // Session cart case
        else {
            return this.attachLocalItem(target, path, id, metadata);
        }
    }

    // Private methods:
    private async attachLocalItem(target: Cart, path: any[], id: string, metadata?: any): Promise<void> {
        // Get item
        const item: SessionCartItem | undefined = this.getLocalItem(id, metadata);
        if (!item) {
            return;
        }

        // Attaching
        await target.addItem(item.id, item.amount, path, item.metadata);
        await this.removeItem(item.id, path, undefined, item.metadata);
    }

    private async attachUserCartItem(target: Cart, path: any[], id: string, metadata?: any): Promise<void> {
        // Get item
        const item: CartItem | undefined = await this.getUserCartItem(id, metadata);
        if (!item) {
            return;
        }

        // Attaching
        await target.addItem(item.Item?.Id as string, item.Amount as number, path, item.Metadata);
        await this.removeItem(id, path, undefined, metadata);
    }

    private async clearUserCart() {
        // Get user
        const user: User = this.user as User;

        // Clear user's cart
        for (const cartItem of (await user.getCart())) {
            await this.domainManager.removeCartItem(cartItem);
        }
    }

    private async clearLocalCart() {
        // Clear cart
        this.items = [];
    }

    private addLocalItem(id: string, amount: number, metadata?: any | undefined): void {
        // Get local item with given info
        const item = this.getLocalItem(id, metadata);

        // Item found case
        if (item) {
            item.amount += Math.abs(amount);
        }
        // Item not found case
        else {
            this.items.push(
                { id, amount: Math.abs(amount), metadata }
            );
        }
    }

    private getLocalItem(id: string, metadata?: any | undefined): SessionCartItem | undefined {
        for (const item of this.items) {
            if (item.id === id) {
                let match = true;

                if (item.metadata) {
                    if (!metadata) {
                        match = false;
                        break;
                    }

                    for (const key of Object.keys(item.metadata)) {
                        if (item.metadata[key] !== metadata[key]) {
                            match = false;
                            break;
                        }
                    }
                }

                if (!match) {
                    continue;
                }

                return item;
            }
        }

        return undefined;
    }

    private async addUserCartItem(id: string, amount: number, path: any[], metadata?: any | undefined): Promise<void> {
        // Get cart item
        let cartItem: CartItem | undefined = await this.getUserCartItem(id, metadata);

        // Found case
        if (cartItem) {
            cartItem.Amount = (cartItem.Amount as number) + Math.abs(amount);
            await this.domainManager.updateCartItem(cartItem);
        }
        else  {
            cartItem = new CartItem();
            cartItem.User = this.user;
            cartItem.Amount = amount;
            cartItem.Metadata = metadata;
            cartItem.Item = await this.domainManager.getItem(id, path);
            await this.domainManager.insertCartItem(cartItem);
            (await this.user?.getCart() as CartItem[]).push(cartItem);
        }
    }

    private async getUserCartItem(id: string, metadata?: any | undefined): Promise<CartItem | undefined> {
        for (const item of (await this.user?.getCart()) as CartItem[]) {
            if ((await item.getItem())?.Id === id) {
                let match: boolean = true;

                if (item.Metadata) {
                    if (!metadata) {
                        match = false;
                        break;
                    }

                    for (const key of Object.keys(item.Metadata)) {
                        if (item.Metadata[key] !== metadata[key]) {
                            match = false;
                            break;
                        }
                    }
                }
                
                if (!match) {
                    continue;
                }
    
                return item;
            }

        }

        return undefined;
    }

    private removeLocalItem(id: string, amount?: number | undefined, metadata?: any | undefined): void {
        // Get local item
        const item = this.getLocalItem(id, metadata);

        // Item not found case
        if (!item) {
            throw Cart.CARTITEM_NOT_FOUND;
        }

        // Item found case
        // Amount provided case
        if (amount) {
            item.amount -= Math.abs(amount);
            if (item.amount < 1) {
                this.items.splice(
                    this.items.indexOf(item), 1
                );
            }
        }
        // Amount not provided case
        else {
            this.items.splice(this.items.indexOf(item), 1);
        }
    }

    private async removeUserCartItem(id: string, path: any[], amount?: number, metadata?: any | undefined): Promise<void> {
        // Get user's cart item
        const cartItem = await this.getUserCartItem(id, metadata);

        // CartItem not found case
        if (!cartItem) {
            throw Cart.CARTITEM_NOT_FOUND;
        }

        // Get user's cart
        const cart: CartItem[] = await this.user?.getCart() as CartItem[];

        // CartItem found case
        // amount provided case
        if (amount) {
            cartItem.Amount = (cartItem.Amount as number) - Math.abs(amount);

            if (cartItem.Amount > 0) {
                await this.domainManager.updateCartItem(cartItem);
            }
            else {
                await this.domainManager.removeCartItem(cartItem);
                cart.splice(
                    cart.indexOf(cartItem), 1
                );
                cartItem.User = undefined;
            }
        }
        else {
            await this.domainManager.removeCartItem(cartItem);
            cart.splice(
                cart.indexOf(cartItem), 1
            );
            cartItem.User = undefined;
        }
    }
}

export interface SessionCartItem {
    id: string, amount: number, metadata?: any | undefined
}