import DBHandler from "./DBHandler";
import PersistenceHandler from "./PersistenceHandler";
import BrandData from "./data/BrandData";
import CartItemData from "./data/CartItemData";
import ItemData from "./data/ItemData";
import ItemImageData from "./data/ItemImageData";
import ItemTypeData from "./data/ItemTypeData";
import OrderData from "./data/OrderData";
import OrderItemData from "./data/OrderItemData";
import UserData from "./data/UserData";
import VerificationCodeData from "./data/VerificationCodeData";
import CartItemPrimaryKey from "./pkeys/CartItemPrimaryKey";
import ItemImagePrimaryKey from "./pkeys/ItemImagePrimaryKey";
import OrderItemPrimaryKey from "./pkeys/OrderItemPrimaryKey";
import VerificationCodePrimaryKey from "./pkeys/VerificationCodePrimaryKey";

export default class PersistenceHandlerImpl implements PersistenceHandler {
    // Fields:
    private brandDBHandler?: DBHandler<BrandData, string> | undefined;
    private cartItemDBHandler?: DBHandler<CartItemData, CartItemPrimaryKey> | undefined;
    private itemDBHandler?: DBHandler<ItemData, string> | undefined;
    private itemImageDBHandler?: DBHandler<ItemImageData, ItemImagePrimaryKey> | undefined;
    private itemTypeDBHandler?: DBHandler<ItemTypeData, string> | undefined;
    private orderDBHandler?: DBHandler<OrderData, string> | undefined;
    private orderItemDBHandler?: DBHandler<OrderItemData, OrderItemPrimaryKey> | undefined;
    private userDBHandler?: DBHandler<UserData, string> | undefined;

    // Constructor:
    public constructor(
        brandDBHandler?: DBHandler<BrandData, string> | undefined,
        cartItemDBHandler?: DBHandler<CartItemData, CartItemPrimaryKey> | undefined,
        itemDBHandler?: DBHandler<ItemData, string> | undefined,
        itemImageDBHandler?: DBHandler<ItemImageData, ItemImagePrimaryKey> | undefined,
        itemTypeDBHandler?: DBHandler<ItemTypeData, string> | undefined,
        orderDBHandler?: DBHandler<OrderData, string> | undefined,
        orderItemDBHandler?: DBHandler<OrderItemData, OrderItemPrimaryKey> | undefined,
        userDBHandler?: DBHandler<UserData, string> | undefined
    ) {
        this.brandDBHandler = brandDBHandler;
        this.cartItemDBHandler = cartItemDBHandler;
        this.itemDBHandler = itemDBHandler;
        this.itemImageDBHandler = itemImageDBHandler;
        this.itemTypeDBHandler = itemTypeDBHandler;
        this.orderDBHandler = orderDBHandler;
        this.orderItemDBHandler = orderItemDBHandler;
        this.userDBHandler = userDBHandler;
    }

    // Private methods:
    private async useCartItemDBHandler<T>(
        executable: (cartItemDBHandler: DBHandler<CartItemData, CartItemPrimaryKey>) => Promise<T>
    ): Promise<T> {
        if (!this.cartItemDBHandler) {
            throw new Error("cartItemDBHandler field is missing!");
        }

        return executable(
            this.cartItemDBHandler
        );
    }

    private async useItemImageDBHandler<T>(
        executable: (itemImageDBHandler: DBHandler<ItemImageData, ItemImagePrimaryKey>) => Promise<T>
    ): Promise<T> {
        if (!this.itemImageDBHandler) {
            throw new Error("itemImageDBHandler field is missing!");
        }

        return executable(this.itemImageDBHandler);
    }

    private async useItemTypeDBHandler<T>(
        executable: (itemTypeDBHandler: DBHandler<ItemTypeData, string>) => Promise<T>
    ): Promise<T> {
        if (!this.itemTypeDBHandler) {
            throw new Error("itemTypeDBHandler field is missing!");
        }

        return executable(this.itemTypeDBHandler);
    }

   // Methods:
    public async getCartItem(pKey: CartItemPrimaryKey): Promise<CartItemData | undefined> {
        return this.useCartItemDBHandler<CartItemData | undefined>(
            async function (cartItemDBHandler: DBHandler<CartItemData, CartItemPrimaryKey>): Promise<CartItemData | undefined> {
                return cartItemDBHandler.get(pKey);
            }
        );
    }

    public async getAllCartItems(): Promise<CartItemData[]> {
        return this.useCartItemDBHandler<CartItemData[]>(
            async function (
                cartItemDBHandler: DBHandler<CartItemData, CartItemPrimaryKey>
            ): Promise<CartItemData[]> {
                return cartItemDBHandler.getAll();
            }
        );
    }

    public async getCartItemsByFilter(filter: any): Promise<CartItemData[]> {
        return this.useCartItemDBHandler<CartItemData[]>(
            async function (
                cartItemDBHandler: DBHandler<CartItemData, CartItemPrimaryKey>
            ) {
                return cartItemDBHandler.getByFilter(filter);
            }
        );
    }

    public async insertCartItem(target: CartItemData): Promise<void> {
        return this.useCartItemDBHandler<void>(
            async function (
                cartItemDBHandler: DBHandler<CartItemData, CartItemPrimaryKey>
            ) {
                return cartItemDBHandler.insert(target);
            }
        );
    }

    public async updateCartItem(target: CartItemData): Promise<void> {
        return this.useCartItemDBHandler<void>(
            async function (
                cartItemDBHandler: DBHandler<CartItemData, CartItemPrimaryKey>
            ) {
                return cartItemDBHandler.update(target);
            }
        );
    }

    public async removeCartItem(target: CartItemData): Promise<void> {
        return this.useCartItemDBHandler<void>(
            async function (
                cartItemDBHandler: DBHandler<CartItemData, CartItemPrimaryKey>
            ) {
                return cartItemDBHandler.remove(target);
            }
        );
    }
    public async removeCartItemByPrimaryKey(pKey: CartItemPrimaryKey): Promise<void> {
        return this.useCartItemDBHandler<void>(
            async function (
                cartItemDBHandler: DBHandler<CartItemData, CartItemPrimaryKey>
            ) {
                return cartItemDBHandler.removeByPrimaryKey(pKey);
            }
        );
    }

    public async getItemImage(pKey: ItemImagePrimaryKey): Promise<ItemImageData | undefined> {
        return this.useItemImageDBHandler<ItemImageData | undefined>(
            async function (
                itemImageDBHandler: DBHandler<ItemImageData, ItemImagePrimaryKey>
            ): Promise<ItemImageData | undefined> {
                return itemImageDBHandler.get(pKey);
            }
        );
    }

    public async getAllItemImages(): Promise<ItemImageData[]> {
        return this.useItemImageDBHandler<ItemImageData[]>(
            async function (
                itemImageDBHandler: DBHandler<ItemImageData, ItemImagePrimaryKey>
            ): Promise<ItemImageData[]> {
                return itemImageDBHandler.getAll();
            }
        );
    }

    public async getItemImagesByFilter(filter: any): Promise<ItemImageData[]> {
        return this.useItemImageDBHandler<ItemImageData[]>(
            async function (
                itemImageDBHandler: DBHandler<ItemImageData, ItemImagePrimaryKey>
            ): Promise<ItemImageData[]> {
                return itemImageDBHandler.getByFilter(filter);
            }
        );
    }

    public async insertItemImage(target: ItemImageData): Promise<void> {
        return this.useItemImageDBHandler<void>(
            async function (
                itemImageDBHandler: DBHandler<ItemImageData, ItemImagePrimaryKey>
            ): Promise<void> {
                return itemImageDBHandler.insert(target);
            }
        );
    }

    public async updateItemImage(target: ItemImageData): Promise<void> {
        return this.useItemImageDBHandler<void>(
            async function (
                itemImageDBHandler: DBHandler<ItemImageData, ItemImagePrimaryKey>
            ): Promise<void> {
                return itemImageDBHandler.update(target);
            }
        );
    }

    public async removeItemImage(target: ItemImageData): Promise<void> {
        return this.useItemImageDBHandler<void>(
            async function (
                itemImageDBHandler: DBHandler<ItemImageData, ItemImagePrimaryKey>
            ): Promise<void> {
                return itemImageDBHandler.remove(target);
            }
        );
    }

    public async removeItemImageByPrimaryKey(pKey: ItemImagePrimaryKey): Promise<void> {
        return this.useItemImageDBHandler<void>(
            async function (
                itemImageDBHandler: DBHandler<ItemImageData, ItemImagePrimaryKey>
            ): Promise<void> {
                return itemImageDBHandler.removeByPrimaryKey(pKey);
            }
        );
    }

    public async getItemType(pKey: string): Promise<ItemTypeData | undefined> {
        return this.useItemTypeDBHandler<ItemTypeData | undefined>(
            async function (
                itemTypeDBHandler: DBHandler<ItemTypeData, string>
            ): Promise<ItemTypeData | undefined> {
                return itemTypeDBHandler.get(pKey);
            }
        );
    }

    public async getAllItemTypes(): Promise<ItemTypeData[]> {
        return this.useItemTypeDBHandler<ItemTypeData[]>(
            async function (
                itemTypeDBHandler: DBHandler<ItemTypeData, string>
            ): Promise<ItemTypeData[]> {
                return itemTypeDBHandler.getAll();
            }
        );
    }

    public async getItemTypesByFilter(filter: any): Promise<ItemTypeData[]> {
        return this.useItemTypeDBHandler<ItemTypeData[]>(
            async function (
                itemTypeDBHandler: DBHandler<ItemTypeData, string>
            ): Promise<ItemTypeData[]> {
                return itemTypeDBHandler.getByFilter(filter);
            }
        );
    }

    public async insertItemType(target: ItemTypeData): Promise<void> {
        return this.useItemTypeDBHandler<void>(
            async function (
                itemTypeDBHandler: DBHandler<ItemTypeData, string>
            ): Promise<void> {
                return itemTypeDBHandler.insert(target);
            }
        );
    }

    public async updateItemType(target: ItemTypeData): Promise<void> {
        return this.useItemTypeDBHandler<void>(
            async function (
                itemTypeDBHandler: DBHandler<ItemTypeData, string>
            ): Promise<void> {
                return itemTypeDBHandler.update(target);
            }
        );
    }

    public async removeItemType(target: ItemTypeData): Promise<void> {
        return this.useItemTypeDBHandler<void>(
            async function (
                itemTypeDBHandler: DBHandler<ItemTypeData, string>
            ): Promise<void> {
                return itemTypeDBHandler.remove(target);
            }
        );
    }

    public async removeItemTypeByPrimaryKey(pKey: string): Promise<void> {
        return this.useItemTypeDBHandler<void>(
            async function(
                itemTypeDBHandler: DBHandler<ItemTypeData, string>
            ): Promise<void> {
                return itemTypeDBHandler.removeByPrimaryKey(pKey);
            }
        );
    }

    getBrand(pKey: string): Promise<BrandData | undefined> {
        throw new Error("Method not implemented.");
    }
    getAllBrands(): Promise<BrandData[]> {
        throw new Error("Method not implemented.");
    }
    getBrandsByFilter(filter: any): Promise<BrandData[]> {
        throw new Error("Method not implemented.");
    }
    insertBrand(target: BrandData): Promise<void> {
        throw new Error("Method not implemented.");
    }
    updateBrand(target: BrandData): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeBrand(target: BrandData): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeBrandByPrimaryKey(pKey: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getUser(pKey: string): Promise<UserData | undefined> {
        throw new Error("Method not implemented.");
    }
    getAllUsers(): Promise<UserData[]> {
        throw new Error("Method not implemented.");
    }
    getUsersByFilter(filter: any): Promise<UserData[]> {
        throw new Error("Method not implemented.");
    }
    insertUser(target: UserData): Promise<void> {
        throw new Error("Method not implemented.");
    }
    updateUser(target: UserData): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeUser(target: UserData): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeUserByPrimaryKey(pKey: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getItem(pKey: string): Promise<ItemData | undefined> {
        throw new Error("Method not implemented.");
    }
    getAllItems(): Promise<ItemData[]> {
        throw new Error("Method not implemented.");
    }
    getItemsByFilter(filter: any): Promise<ItemData[]> {
        throw new Error("Method not implemented.");
    }
    insertItem(target: ItemData): Promise<void> {
        throw new Error("Method not implemented.");
    }
    updateItem(target: ItemData): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeItem(target: ItemData): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeItemByPrimaryKey(pKey: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getOrder(pKey: string): Promise<OrderData | undefined> {
        throw new Error("Method not implemented.");
    }
    getAllOrders(): Promise<OrderData[]> {
        throw new Error("Method not implemented.");
    }
    getOrdersByFilter(filer: any): Promise<OrderData[]> {
        throw new Error("Method not implemented.");
    }
    insertOrder(target: OrderData): Promise<void> {
        throw new Error("Method not implemented.");
    }
    updateOrder(target: OrderData): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeOrder(target: OrderData): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeOrderByPrimaryKey(pKey: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getOrderItem(pKey: OrderItemPrimaryKey): Promise<OrderItemData | undefined> {
        throw new Error("Method not implemented.");
    }
    getAllOrderItems(): Promise<OrderItemData[]> {
        throw new Error("Method not implemented.");
    }
    getOrderItemsByFilter(filter: any): Promise<OrderItemData[]> {
        throw new Error("Method not implemented.");
    }
    insertOrderItem(target: OrderItemData): Promise<void> {
        throw new Error("Method not implemented.");
    }
    updateOrderItem(target: OrderItemData): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeOrderItem(target: OrderItemData): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeOrderItemByPrimaryKey(pKey: OrderItemPrimaryKey): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getVerificationCode(pKey: VerificationCodePrimaryKey): Promise<VerificationCodeData | undefined> {
        throw new Error("Method not implemented.");
    }
    getAllVerificationCodes(): Promise<VerificationCodeData[]> {
        throw new Error("Method not implemented.");
    }
    getVerificationCodesByFilter(filter: any): Promise<VerificationCodeData[]> {
        throw new Error("Method not implemented.");
    }
    insertVerificationCode(target: VerificationCodeData): Promise<void> {
        throw new Error("Method not implemented.");
    }
    updateVerificationCode(target: VerificationCodeData): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeVerificationCode(target: VerificationCodeData): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeVerificationCodeByPrimaryKey(pKey: VerificationCodePrimaryKey): Promise<void> {
        throw new Error("Method not implemented.");
    }

    // Getters / setters:
    public get BrandDBHandler(): DBHandler<BrandData, string> | undefined {
        return this.brandDBHandler;
    }

    public set BrandDBHandler(
        brandDBHandler: DBHandler<BrandData, string> | undefined
    ) {
        this.brandDBHandler = brandDBHandler;
    }

    public get CartItemDBHandler(): DBHandler<CartItemData, CartItemPrimaryKey> | undefined {
        return this.cartItemDBHandler;
    }

    public set CartItemDBHandler(
        cartItemDBHandler: DBHandler<CartItemData, CartItemPrimaryKey> | undefined
    ) {
        this.cartItemDBHandler = cartItemDBHandler;
    }

    public get ItemDBHandler(): DBHandler<ItemData, string> | undefined {
        return this.itemDBHandler;
    }

    public set ItemDBHandler(value: DBHandler<ItemData, string> | undefined) {
        this.itemDBHandler = value;
    }

    public get ItemImageDBHandler(): DBHandler<ItemImageData, ItemImagePrimaryKey> | undefined {
        return this.itemImageDBHandler;
    }

    public set ItemImageDBHandler(value: DBHandler<ItemImageData, ItemImagePrimaryKey> | undefined) {
        this.itemImageDBHandler = value;
    }

    public get ItemTypeDBHandler(): DBHandler<ItemTypeData, string> | undefined {
        return this.itemTypeDBHandler;
    }

    public set ItemTypeDBHandler(value: DBHandler<ItemTypeData, string> | undefined) {
        this.itemTypeDBHandler = value;
    }

    public get OrderDBHandler(): DBHandler<OrderData, string> | undefined {
        return this.orderDBHandler;
    }

    public set OrderDBHandler(value: DBHandler<OrderData, string> | undefined) {
        this.orderDBHandler = value;
    }

    public get OrderItemDBHandler(): DBHandler<OrderItemData, OrderItemPrimaryKey> | undefined {
        return this.orderItemDBHandler;
    }

    public set OrderItemDBHandler(value: DBHandler<OrderItemData, OrderItemPrimaryKey> | undefined) {
        this.orderItemDBHandler = value;
    }

    public get UserDBHandler(): DBHandler<UserData, string> | undefined {
        return this.userDBHandler;
    }

    public set UserDBHandler(value: DBHandler<UserData, string> | undefined) {
        this.userDBHandler = value;
    }
}