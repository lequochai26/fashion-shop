import DomainManager from "./DomainManager";
import CartItem from "./entities/CartItem";
import User from "./entities/User";

export default class Cart {
    // Static fields:
    public static CARTITEM_NOT_FOUND: number = 1;

    // Fields:
    private user?: User | undefined;
    private items: { id: string, amount: number, metadata?: any | undefined }[];
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
            return this.user.Cart;
        }
        else {
            const cartItems: CartItem[] = [];

            for (const { id, amount, metadata } of this.items) {
                const cartItem: CartItem = new CartItem();
                cartItem.Item = await this.domainManager.getItem(id, path);
                cartItem.Amount = amount;
                cartItem.Metadata = metadata;
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

    // Private methods:
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

    private getLocalItem(id: string, metadata?: any | undefined): { id: string, amount: number, metadata?: any | undefined } | undefined {
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
        let cartItem: CartItem | undefined = this.getUserCartItem(id, metadata);

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
            this.user?.Cart.push(cartItem);
        }
    }

    private getUserCartItem(id: string, metadata?: any | undefined): CartItem | undefined {
        for (const item of this.user?.Cart as CartItem[]) {
            if (item.Item?.Id === id) {
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
        const cartItem = this.getUserCartItem(id, metadata);

        // CartItem not found case
        if (!cartItem) {
            throw Cart.CARTITEM_NOT_FOUND;
        }

        // CartItem found case
        // amount provided case
        if (amount) {
            cartItem.Amount = (cartItem.Amount as number) - Math.abs(amount);

            if (cartItem.Amount > 0) {
                await this.domainManager.updateCartItem(cartItem);
            }
            else {
                await this.domainManager.removeCartItem(cartItem);
                this.user?.Cart.splice(
                    this.user?.Cart.indexOf(cartItem), 1
                );
                cartItem.User = undefined;
            }
        }
        else {
            await this.domainManager.removeCartItem(cartItem);
            this.user?.Cart.splice(
                this.user?.Cart.indexOf(cartItem), 1
            );
            cartItem.User = undefined;
        }
    }
}