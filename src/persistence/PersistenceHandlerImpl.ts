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
    private verificationCodeDBHandler?: DBHandler<VerificationCodeData, VerificationCodePrimaryKey> | undefined;

    // Constructor:
    public constructor(
        brandDBHandler?: DBHandler<BrandData, string> | undefined,
        cartItemDBHandler?: DBHandler<CartItemData, CartItemPrimaryKey> | undefined,
        itemDBHandler?: DBHandler<ItemData, string> | undefined,
        itemImageDBHandler?: DBHandler<ItemImageData, ItemImagePrimaryKey> | undefined,
        itemTypeDBHandler?: DBHandler<ItemTypeData, string> | undefined,
        orderDBHandler?: DBHandler<OrderData, string> | undefined,
        orderItemDBHandler?: DBHandler<OrderItemData, OrderItemPrimaryKey> | undefined,
        userDBHandler?: DBHandler<UserData, string> | undefined,
        verificationCodeDBHandler?: DBHandler<VerificationCodeData, VerificationCodePrimaryKey> | undefined
    ) {
        this.brandDBHandler = brandDBHandler;
        this.cartItemDBHandler = cartItemDBHandler;
        this.itemDBHandler = itemDBHandler;
        this.itemImageDBHandler = itemImageDBHandler;
        this.itemTypeDBHandler = itemTypeDBHandler;
        this.orderDBHandler = orderDBHandler;
        this.orderItemDBHandler = orderItemDBHandler;
        this.userDBHandler = userDBHandler;
        this.verificationCodeDBHandler = verificationCodeDBHandler;
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

    private async useBrandDBHandler<T>(
        executable: (brandDBHandler: DBHandler<BrandData, string>) => Promise<T>
    ): Promise<T> {
        if (!this.brandDBHandler) {
            throw new Error("brandDBHandler field is missing!");
        }

        return executable(this.brandDBHandler);
    }

    private async useUserDBHandler<T>(
        executable: (userDBHandler: DBHandler<UserData, string>) => Promise<T>
    ): Promise<T> {
        if (!this.userDBHandler) {
            throw new Error("userDBHandler field is missing!");
        }

        return executable(this.userDBHandler);
    }

    private async useItemDBHandler<T>(
        executable: (itemDBHandler: DBHandler<ItemData, string>) => Promise<T>
    ): Promise<T> {
        if (!this.itemDBHandler) {
            throw new Error("itemDBHandler field is missing!");
        }

        return executable(this.itemDBHandler);
    }

    private async useOrderDBHandler<T>(
        executable: (orderDBHandler: DBHandler<OrderData, string>) => Promise<T>
    ): Promise<T> {
        if (!this.orderDBHandler) {
            throw new Error("orderDBHandler field is missing!");
        }

        return executable(this.orderDBHandler);
    }

    private async useOrderItemDBHandler<T>(
        executable: (orderItemDBHandler: DBHandler<OrderItemData, OrderItemPrimaryKey>) => Promise<T>
    ): Promise<T> {
        if (!this.orderItemDBHandler) {
            throw new Error("orderItemDBHandler field is missing!");
        }

        return executable(this.orderItemDBHandler);
    }

    private async useVerificationCodeDBHandler<T>(
        executable: (veriicationCodeDBHandler: DBHandler<VerificationCodeData, VerificationCodePrimaryKey>) => Promise<T>
    ): Promise<T> {
        if (!this.verificationCodeDBHandler) {
            throw new Error("verificationCodeDBHandler field is missing!");
        }

        return executable(this.verificationCodeDBHandler);
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

    public async getBrand(pKey: string): Promise<BrandData | undefined> {
        return this.useBrandDBHandler<BrandData | undefined>(
            async function (brandDBHandler) {
                return brandDBHandler.get(pKey);
            }
        );
    }

    public async getAllBrands(): Promise<BrandData[]> {
        return this.useBrandDBHandler<BrandData[]>(
            async function (brandDBHandler) {
                return brandDBHandler.getAll();
            }
        );
    }

    public async getBrandsByFilter(filter: any): Promise<BrandData[]> {
        return this.useBrandDBHandler<BrandData[]>(
            async function (brandDBHandler) {
                return brandDBHandler.getByFilter(filter);
            }
        );
    }

    public async insertBrand(target: BrandData): Promise<void> {
        return this.useBrandDBHandler<void>(
            async function (brandDBHandler) {
                return brandDBHandler.insert(target);
            }
        );
    }

    public async updateBrand(target: BrandData): Promise<void> {
        return this.useBrandDBHandler<void>(
            async function (brandDBHandler) {
                return brandDBHandler.update(target);
            }
        );
    }

    public async removeBrand(target: BrandData): Promise<void> {
        return this.useBrandDBHandler<void>(
            async function (brandDBHandler) {
                return brandDBHandler.remove(target);
            }
        );
    }

    public async removeBrandByPrimaryKey(pKey: string): Promise<void> {
        return this.useBrandDBHandler<void>(
            async function (brandDBHandler) {
                return brandDBHandler.removeByPrimaryKey(pKey);
            }
        )
    }

    public async getUser(pKey: string): Promise<UserData | undefined> {
        return this.useUserDBHandler<UserData | undefined>(
            async function (userDBHandler) {
                return userDBHandler.get(pKey);
            }
        );
    }

    public async getAllUsers(): Promise<UserData[]> {
        return this.useUserDBHandler<UserData[]>(
            async function (userDBHandler) {
                return userDBHandler.getAll();
            }
        );
    }

    public async getUsersByFilter(filter: any): Promise<UserData[]> {
        return this.useUserDBHandler<UserData[]>(
            async function (userDBHandler) {
                return userDBHandler.getByFilter(filter);
            }
        );
    }

    public async insertUser(target: UserData): Promise<void> {
        return this.useUserDBHandler<void>(
            async function (userDBHandler) {
                return userDBHandler.insert(target);
            }
        );
    }

    public async updateUser(target: UserData): Promise<void> {
        return this.useUserDBHandler<void>(
            async function (userDBHandler) {
                return userDBHandler.update(target);
            }
        );
    }

    public async removeUser(target: UserData): Promise<void> {
        return this.useUserDBHandler<void>(
            async function (userDBHandler) {
                return userDBHandler.remove(target);
            }
        );
    }

    public async removeUserByPrimaryKey(pKey: string): Promise<void> {
        return this.useUserDBHandler<void>(
            async function (userDBHandler) {
                return userDBHandler.removeByPrimaryKey(pKey);
            }
        );
    }

    public async getItem(pKey: string): Promise<ItemData | undefined> {
        return this.useItemDBHandler<ItemData | undefined>(
            async function (itemDBHandler) {
                return itemDBHandler.get(pKey);
            }
        );
    }

    public async getAllItems(): Promise<ItemData[]> {
        return this.useItemDBHandler<ItemData[]>(
            async function (itemDBHandler) {
                return itemDBHandler.getAll();
            }
        );
    }

    public async getItemsByFilter(filter: any): Promise<ItemData[]> {
        return this.useItemDBHandler<ItemData[]>(
            async function (itemDBHandler) {
                return itemDBHandler.getByFilter(filter);
            }
        );
    }

    public async insertItem(target: ItemData): Promise<void> {
        return this.useItemDBHandler<void>(
            async function (itemDBHandler) {
                return itemDBHandler.insert(target);
            }
        );
    }

    public async updateItem(target: ItemData): Promise<void> {
        return this.useItemDBHandler<void>(
            async function (itemDBHandler) {
                return itemDBHandler.update(target);
            }
        );
    }

    public async removeItem(target: ItemData): Promise<void> {
        return this.useItemDBHandler<void>(
            async function (itemDBHandler) {
                return itemDBHandler.remove(target);
            }
        );
    }

    public async removeItemByPrimaryKey(pKey: string): Promise<void> {
        return this.useItemDBHandler<void>(
            async function (itemDBHandler) {
                return itemDBHandler.removeByPrimaryKey(pKey);
            }
        );
    }

    public async getOrder(pKey: string): Promise<OrderData | undefined> {
        return this.useOrderDBHandler<OrderData | undefined>(
            async function (orderDBHandler) {
                return orderDBHandler.get(pKey);
            }
        );
    }
    
    public async getAllOrders(): Promise<OrderData[]> {
        return this.useOrderDBHandler<OrderData[]>(
            async function (orderDBHandler) {
                return orderDBHandler.getAll();
            }
        );
    }

    public async getOrdersByFilter(filter: any): Promise<OrderData[]> {
        return this.useOrderDBHandler<OrderData[]>(
            async function (orderDBHandler) {
                return orderDBHandler.getByFilter(filter);
            }
        )
    }

    public async insertOrder(target: OrderData): Promise<void> {
        return this.useOrderDBHandler<void>(
            async function (orderDBHandler) {
                return orderDBHandler.insert(target);
            }
        );
    }

    public async updateOrder(target: OrderData): Promise<void> {
        return this.useOrderDBHandler<void>(
            async function (orderDBHandler) {
                return orderDBHandler.update(target);
            }
        );
    }

    public async removeOrder(target: OrderData): Promise<void> {
        return this.useOrderDBHandler<void>(
            async function (orderDBHandler) {
                return orderDBHandler.remove(target);
            }
        );
    }

    public async removeOrderByPrimaryKey(pKey: string): Promise<void> {
        return this.useOrderDBHandler<void>(
            async function (orderDBHandler) {
                return orderDBHandler.removeByPrimaryKey(pKey);
            }
        );
    }

    public async getOrderItem(pKey: OrderItemPrimaryKey): Promise<OrderItemData | undefined> {
        return this.useOrderItemDBHandler<OrderItemData | undefined>(
            async function (orderItemDBHandler) {
                return orderItemDBHandler.get(pKey);
            }
        );
    }

    public async getAllOrderItems(): Promise<OrderItemData[]> {
        return this.useOrderItemDBHandler<OrderItemData[]>(
            async function (orderItemDBHandler) {
                return orderItemDBHandler.getAll();
            }
        )
    }

    public async getOrderItemsByFilter(filter: any): Promise<OrderItemData[]> {
        return this.useOrderItemDBHandler<OrderItemData[]>(
            async function (orderItemDBHandler) {
                return orderItemDBHandler.getByFilter(filter);
            }
        );
    }

    public async insertOrderItem(target: OrderItemData): Promise<void> {
        return this.useOrderItemDBHandler<void>(
            async function (orderItemDBHandler) {
                return orderItemDBHandler.insert(target);
            }
        );
    }

    public async updateOrderItem(target: OrderItemData): Promise<void> {
        return this.useOrderItemDBHandler<void>(
            async function (orderItemDBHandler) {
                return orderItemDBHandler.update(target);
            }
        );
    }

    public async removeOrderItem(target: OrderItemData): Promise<void> {
        return this.useOrderItemDBHandler<void>(
            async function (orderItemDBHandler) {
                return orderItemDBHandler.remove(target);
            }
        );
    }

    public async removeOrderItemByPrimaryKey(pKey: OrderItemPrimaryKey): Promise<void> {
        return this.useOrderItemDBHandler<void>(
            async function (orderItemDBHandler) {
                return orderItemDBHandler.removeByPrimaryKey(pKey)
            }
        );
    }

    public async getVerificationCode(pKey: VerificationCodePrimaryKey): Promise<VerificationCodeData | undefined> {
        return this.useVerificationCodeDBHandler<VerificationCodeData | undefined>(
            async function (verificationCodeDBHandler) {
                return verificationCodeDBHandler.get(pKey);
            }
        );
    }

    public async getAllVerificationCodes(): Promise<VerificationCodeData[]> {
        return this.useVerificationCodeDBHandler<VerificationCodeData[]>(
            async function (verificationCodeDBHandler) {
                return verificationCodeDBHandler.getAll();
            }
        );
    }

    public async getVerificationCodesByFilter(filter: any): Promise<VerificationCodeData[]> {
        return this.useVerificationCodeDBHandler<VerificationCodeData[]>(
            async function (verificationCodeDBHandler) {
                return verificationCodeDBHandler.getByFilter(filter);
            }
        );
    }

    public async insertVerificationCode(target: VerificationCodeData): Promise<void> {
        return this.useVerificationCodeDBHandler<void>(
            async function (verificationCodeDBHandler) {
                verificationCodeDBHandler.insert(target);
            }
        );
    }

    public async updateVerificationCode(target: VerificationCodeData): Promise<void> {
        return this.useVerificationCodeDBHandler<void>(
            async function (verificationCodeDBHandler) {
                return verificationCodeDBHandler.update(target);
            }
        );
    }

    public async removeVerificationCode(target: VerificationCodeData): Promise<void> {
        return this.useVerificationCodeDBHandler<void>(
            async function (verificationCodeDBHandler) {
                return verificationCodeDBHandler.remove(target);
            }
        );
    }

    public async removeVerificationCodeByPrimaryKey(pKey: VerificationCodePrimaryKey): Promise<void> {
        return this.useVerificationCodeDBHandler<void>(
            async function (verificationCodeDBHandler) {
                return verificationCodeDBHandler.removeByPrimaryKey(pKey);
            }
        );
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

    public get VerificationCodeDBHandler(): DBHandler<VerificationCodeData, VerificationCodePrimaryKey> | undefined {
        return this.verificationCodeDBHandler;
    }

    public set VerificationCodeDBHandler(
        verificationCodeDBHandler: DBHandler<VerificationCodeData, VerificationCodePrimaryKey> | undefined
    ) {
        this.verificationCodeDBHandler = verificationCodeDBHandler;
    }
}