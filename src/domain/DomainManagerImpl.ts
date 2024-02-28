import CartItemPrimaryKey from "../persistence/pkeys/CartItemPrimaryKey";
import ItemImagePrimaryKey from "../persistence/pkeys/ItemImagePrimaryKey";
import OrderItemPrimaryKey from "../persistence/pkeys/OrderItemPrimaryKey";
import VerificationCodePrimaryKey from "../persistence/pkeys/VerificationCodePrimaryKey";
import DomainManager from "./DomainManager";
import EntityManager from "./EntityManager";
import Brand from "./entities/Brand";
import CartItem from "./entities/CartItem";
import Item from "./entities/Item";
import ItemImage from "./entities/ItemImage";
import ItemType from "./entities/ItemType";
import Order from "./entities/Order";
import OrderItem from "./entities/OrderItem";
import User from "./entities/User";
import VerificationCode from "./entities/VerificationCode";

export default class DomainManagerImpl implements DomainManager {
    // Fields:
    private brandManager?: EntityManager<Brand, string> | undefined;
    private cartItemManager?: EntityManager<CartItem, CartItemPrimaryKey> | undefined;
    private itemImageManager?: EntityManager<ItemImage, ItemImagePrimaryKey> | undefined;
    private itemManager?: EntityManager<Item, string> | undefined;
    private itemTypeManager?: EntityManager<ItemType, string> | undefined;
    private orderItemManager?: EntityManager<OrderItem, OrderItemPrimaryKey> | undefined;
    private orderManager?: EntityManager<Order, string> | undefined;
    private userManager?: EntityManager<User, string> | undefined;
    private verificationCodeManager?: EntityManager<VerificationCode, VerificationCodePrimaryKey> | undefined;

    // Constructors:
    public constructor(
        brandManager?: EntityManager<Brand, string> | undefined,
        cartItemManager?: EntityManager<CartItem, CartItemPrimaryKey> | undefined,
        itemImageManager?: EntityManager<ItemImage, ItemImagePrimaryKey> | undefined,
        itemManager?: EntityManager<Item, string> | undefined,
        itemTypeManager?: EntityManager<ItemType, string> | undefined,
        orderItemManager?: EntityManager<OrderItem, OrderItemPrimaryKey> | undefined,
        orderManager?: EntityManager<Order, string> | undefined,
        userManager?: EntityManager<User, string> | undefined,
        verificationCodeManager?: EntityManager<VerificationCode, VerificationCodePrimaryKey> | undefined
    ) {
        this.brandManager = brandManager;
        this.cartItemManager = cartItemManager;
        this.itemImageManager = itemImageManager;
        this.itemManager = itemManager;
        this.itemTypeManager = itemTypeManager;
        this.orderItemManager = orderItemManager;
        this.orderManager = orderManager;
        this.userManager = userManager;
        this.verificationCodeManager = verificationCodeManager;
    }

    // Private methods:
    private async useItemManager<T>(
        executable: (itemManager: EntityManager<Item, string>) => Promise<T>
    ): Promise<T> {
        if (!this.itemManager) {
            throw new Error("itemManager field is missing!");
        }

        return executable(this.itemManager);
    }

    // Methods:
    getCartItem(pKey: CartItemPrimaryKey, path: any[]): Promise<CartItem | undefined> {
        throw new Error("Method not implemented.");
    }
    getAllCartItems(path: any[]): Promise<CartItem[]> {
        throw new Error("Method not implemented.");
    }
    getCartItemsByFilter(filter: any, path: any[]): Promise<CartItem[]> {
        throw new Error("Method not implemented.");
    }
    insertCartItem(target: CartItem): Promise<void> {
        throw new Error("Method not implemented.");
    }
    updateCartItem(target: CartItem): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeCartItem(target: CartItem): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeCartItemByPrimaryKey(pKey: CartItemPrimaryKey): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getCartItemsByFilterFunc(filterFunc: (target: CartItem) => boolean): Promise<CartItem[]> {
        throw new Error("Method not implemented.");
    }
    getItemImage(pKey: ItemImagePrimaryKey, path: any[]): Promise<ItemImage | undefined> {
        throw new Error("Method not implemented.");
    }
    getAllItemImages(path: any[]): Promise<ItemImage[]> {
        throw new Error("Method not implemented.");
    }
    getItemImagesByFilter(filter: any, path: any[]): Promise<ItemImage[]> {
        throw new Error("Method not implemented.");
    }
    insertItemImage(target: ItemImage): Promise<void> {
        throw new Error("Method not implemented.");
    }
    updateItemImage(target: ItemImage): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeItemImage(target: ItemImage): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeItemImageByPrimaryKey(pKey: ItemImagePrimaryKey): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getItemType(pKey: string, path: any[]): Promise<ItemType | undefined> {
        throw new Error("Method not implemented.");
    }
    getAllItemTypes(path: any[]): Promise<ItemType[]> {
        throw new Error("Method not implemented.");
    }
    getItemTypesByFilter(filter: any, path: any[]): Promise<ItemType[]> {
        throw new Error("Method not implemented.");
    }
    insertItemType(target: ItemType): Promise<void> {
        throw new Error("Method not implemented.");
    }
    updateItemType(target: ItemType): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeItemType(target: ItemType): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeItemTypeByPrimaryKey(pKey: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getItemTypesByFilterFunc(filterFunc: (target: ItemType) => boolean): Promise<ItemType[]> {
        throw new Error("Method not implemented.");
    }
    searchItemTypes(pKey: string): Promise<ItemType[]> {
        throw new Error("Method not implemented.");
    }
    getBrand(pKey: string, path: any[]): Promise<Brand | undefined> {
        throw new Error("Method not implemented.");
    }
    getAllBrands(path: any[]): Promise<Brand[]> {
        throw new Error("Method not implemented.");
    }
    getBrandsByFilter(filter: any, path: any[]): Promise<Brand[]> {
        throw new Error("Method not implemented.");
    }
    insertBrand(target: Brand): Promise<void> {
        throw new Error("Method not implemented.");
    }
    updateBrand(target: Brand): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeBrand(target: Brand): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeBrandByPrimaryKey(pKey: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getBrandsByFilterFunc(filterFunc: (target: Brand) => boolean): Promise<Brand[]> {
        throw new Error("Method not implemented.");
    }
    searchBrands(pKey: string): Promise<Brand[]> {
        throw new Error("Method not implemented.");
    }
    getUser(pKey: string, path: any[]): Promise<User | undefined> {
        throw new Error("Method not implemented.");
    }
    getAllUsers(path: any[]): Promise<User[]> {
        throw new Error("Method not implemented.");
    }
    getUsersByFilter(filter: any, path: any[]): Promise<User[]> {
        throw new Error("Method not implemented.");
    }
    insertUser(target: User): Promise<void> {
        throw new Error("Method not implemented.");
    }
    updateUser(target: User): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeUser(target: User): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeUserByPrimaryKey(pKey: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getUsersByFilterFunc(filterFunc: (target: User) => boolean): Promise<User[]> {
        throw new Error("Method not implemented.");
    }
    searchUsers(pKey: string): Promise<User[]> {
        throw new Error("Method not implemented.");
    }

    public async getItem(pKey: string, path: any[]): Promise<Item | undefined> {
        return this.useItemManager(
            async function (itemManager) {
                return itemManager.get(pKey, path);
            }
        );
    }

    public async getAllItems(path: any[]): Promise<Item[]> {
        return this.useItemManager(
            async function (itemManager) {
                return itemManager.getAll(path);
            }
        );
    }

    public async getItemsByFilter(filter: any, path: any[]): Promise<Item[]> {
        return this.useItemManager(
            async function (itemManager) {
                return itemManager.getByFilter(filter, path);
            }
        );
    }

    public async insertItem(target: Item): Promise<void> {
        return this.useItemManager(
            async function (itemManager) {
                return itemManager.insert(target);
            }
        );
    }

    public async updateItem(target: Item): Promise<void> {
        return this.useItemManager(
            async function (itemManager) {
                return itemManager.update(target);
            }
        );
    }

    public async removeItem(target: Item): Promise<void> {
        return this.useItemManager(
            async function (itemManager) {
                return itemManager.remove(target);
            }
        );
    }

    public async removeItemByPrimaryKey(pKey: string): Promise<void> {
        return this.useItemManager(
            async function (itemManager) {
                return itemManager.removeByPrimaryKey(pKey);
            }
        );
    }

    getItemsByFilterFunc(filterFunc: (target: Item) => boolean): Promise<Item[]> {
        throw new Error("Method not implemented.");
    }
    searchItems(pKey: string): Promise<Item[]> {
        throw new Error("Method not implemented.");
    }
    getOrder(pKey: string, path: any[]): Promise<Order | undefined> {
        throw new Error("Method not implemented.");
    }
    getAllOrders(path: any[]): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }
    getOrdersByFilter(filter: any, path: any[]): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }
    insertOrder(target: Order): Promise<void> {
        throw new Error("Method not implemented.");
    }
    updateOrder(target: Order): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeOrder(target: Order): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeOrderByPrimaryKey(pKey: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getOrdersByFilterFunc(filterFunc: (target: Order) => boolean): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }
    searchOrders(pKey: string): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }
    getOrderItem(pKey: OrderItemPrimaryKey, path: any[]): Promise<OrderItem | undefined> {
        throw new Error("Method not implemented.");
    }
    getAllOrderItems(path: any[]): Promise<OrderItem[]> {
        throw new Error("Method not implemented.");
    }
    getOrderItemsByFilter(filter: any, path: any[]): Promise<OrderItem[]> {
        throw new Error("Method not implemented.");
    }
    insertOrderItem(target: OrderItem): Promise<void> {
        throw new Error("Method not implemented.");
    }
    updateOrderItem(target: OrderItem): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeOrderItem(target: OrderItem): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeOrderItemByPrimaryKey(pKey: OrderItemPrimaryKey): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getVerificationCode(pKey: VerificationCodePrimaryKey, path: any[]): Promise<VerificationCode | undefined> {
        throw new Error("Method not implemented.");
    }
    getAllVerificationCodes(path: any[]): Promise<VerificationCode[]> {
        throw new Error("Method not implemented.");
    }
    getVerificationCodesByFilter(filter: any, path: any[]): Promise<VerificationCode[]> {
        throw new Error("Method not implemented.");
    }
    insertVerificationCode(target: VerificationCode): Promise<void> {
        throw new Error("Method not implemented.");
    }
    updateVerificationCode(target: VerificationCode): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeVerificationCode(target: VerificationCode): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeVerificationCodeByPrimaryKey(pKey: VerificationCodePrimaryKey): Promise<void> {
        throw new Error("Method not implemented.");
    }

    // Getters / setters:
    public get BrandManager(): EntityManager<Brand, string> | undefined {
        return this.brandManager;
    }

    public set BrandManager(value: EntityManager<Brand, string> | undefined) {
        this.brandManager = value;
    }

    public get CartItemManager(): EntityManager<CartItem, CartItemPrimaryKey> | undefined {
        return this.cartItemManager;
    }

    public set CartItemManager(value: EntityManager<CartItem, CartItemPrimaryKey> | undefined) {
        this.cartItemManager = value;
    }

    public get ItemImageManager(): EntityManager<ItemImage, ItemImagePrimaryKey> | undefined {
        return this.itemImageManager;
    }

    public set ItemImageManager(value: EntityManager<ItemImage, ItemImagePrimaryKey> | undefined) {
        this.itemImageManager = value;
    }

    public get ItemManager(): EntityManager<Item, string> | undefined {
        return this.itemManager;
    }

    public set ItemManager(value: EntityManager<Item, string> | undefined) {
        this.itemManager = value;
    }

    public get ItemTypeManager(): EntityManager<ItemType, string> | undefined {
        return this.itemTypeManager;
    }

    public set ItemTypeManager(value: EntityManager<ItemType, string> | undefined) {
        this.itemTypeManager = value;
    }

    public get OrderItemManager(): EntityManager<OrderItem, OrderItemPrimaryKey> | undefined {
        return this.orderItemManager;
    }

    public set OrderItemManager(value: EntityManager<OrderItem, OrderItemPrimaryKey> | undefined) {
        this.orderItemManager = value;
    }

    public get OrderManager(): EntityManager<Order, string> | undefined {
        return this.orderManager;
    }
    public set OrderManager(value: EntityManager<Order, string> | undefined) {
        this.orderManager = value;
    }

    public get UserManager(): EntityManager<User, string> | undefined {
        return this.userManager;
    }

    public set UserManager(value: EntityManager<User, string> | undefined) {
        this.userManager = value;
    }

    public get VerificationCodeManager(): EntityManager<VerificationCode, VerificationCodePrimaryKey> | undefined {
        return this.verificationCodeManager;
    }
    
    public set VerificationCodeManager(value: EntityManager<VerificationCode, VerificationCodePrimaryKey> | undefined) {
        this.verificationCodeManager = value;
    }
}