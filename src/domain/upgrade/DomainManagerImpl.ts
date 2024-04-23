import CartItemPrimaryKey from "../../persistence/pkeys/CartItemPrimaryKey";
import ItemImagePrimaryKey from "../../persistence/pkeys/ItemImagePrimaryKey";
import OrderItemPrimaryKey from "../../persistence/pkeys/OrderItemPrimaryKey";
import VerificationCodePrimaryKey from "../../persistence/pkeys/VerificationCodePrimaryKey";
import Brand from "../entities/upgrade/Brand";
import CartItem from "../entities/upgrade/CartItem";
import Item from "../entities/upgrade/Item";
import ItemImage from "../entities/upgrade/ItemImage";
import ItemType from "../entities/upgrade/ItemType";
import Order from "../entities/upgrade/Order";
import OrderItem from "../entities/upgrade/OrderItem";
import User from "../entities/upgrade/User";
import VerificationCode from "../entities/VerificationCode";
import EntityManager from "../EntityManager";
import FileHandler from "../FileHandler";
import SearchableEntityManager from "../SearchableEntityManager";
import DomainManager from "./DomainManager";
import OrderHandler, { OrderHandlerParam } from "./OrderHandler";

export default class DomainManagerImpl implements DomainManager {
    // Fields:
    private brandManager?: SearchableEntityManager<Brand, string> | undefined;
    private cartItemManager?: EntityManager<CartItem, CartItemPrimaryKey> | undefined;
    private itemImageManager?: EntityManager<ItemImage, ItemImagePrimaryKey> | undefined;
    private itemManager?: SearchableEntityManager<Item, string> | undefined;
    private itemTypeManager?: SearchableEntityManager<ItemType, string> | undefined;
    private orderItemManager?: EntityManager<OrderItem, OrderItemPrimaryKey> | undefined;
    private orderManager?: SearchableEntityManager<Order, string> | undefined;
    private userManager?: SearchableEntityManager<User, string> | undefined;
    private verificationCodeManager?: EntityManager<VerificationCode, VerificationCodePrimaryKey> | undefined;
    private fileHandler?: FileHandler | undefined;
    private orderHandler?: OrderHandler | undefined;

    // Constructors:
    public constructor(
        brandManager?: SearchableEntityManager<Brand, string> | undefined,
        cartItemManager?: EntityManager<CartItem, CartItemPrimaryKey> | undefined,
        itemImageManager?: EntityManager<ItemImage, ItemImagePrimaryKey> | undefined,
        itemManager?: SearchableEntityManager<Item, string> | undefined,
        itemTypeManager?: SearchableEntityManager<ItemType, string> | undefined,
        orderItemManager?: EntityManager<OrderItem, OrderItemPrimaryKey> | undefined,
        orderManager?: SearchableEntityManager<Order, string> | undefined,
        userManager?: SearchableEntityManager<User, string> | undefined,
        verificationCodeManager?: EntityManager<VerificationCode, VerificationCodePrimaryKey> | undefined,
        fileHandler?: FileHandler | undefined,
        orderHandler?: OrderHandler | undefined
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
        this.fileHandler = fileHandler;
        this.orderHandler = orderHandler;
    }

    // Private methods:
    private async useBrandManager<T>(
        executable: (brandManager: SearchableEntityManager<Brand, string>) => Promise<T>
    ): Promise<T> {
        if (!this.brandManager) {
            throw new Error("brandManager field is missing!");
        }

        return executable(this.brandManager);
    }

    private async useCartItemManager<T>(
        executable: (cartItemManager: EntityManager<CartItem, CartItemPrimaryKey>) => Promise<T>
    ): Promise<T> {
        if (!this.cartItemManager) {
            throw new Error("cartItemManager field is missing!");
        }

        return executable(this.cartItemManager);
    }

    private async useItemImageManager<T>(
        executable: (itemImageManager: EntityManager<ItemImage, ItemImagePrimaryKey>) => Promise<T>
    ): Promise<T> {
        if (!this.itemImageManager) {
            throw new Error("itemImageManager field is missing!");
        }

        return executable(this.itemImageManager);
    }

    private async useItemManager<T>(
        executable: (itemManager: SearchableEntityManager<Item, string>) => Promise<T>
    ): Promise<T> {
        if (!this.itemManager) {
            throw new Error("itemManager field is missing!");
        }

        return executable(this.itemManager);
    }

    private async useItemTypeManager<T>(
        executable: (itemTypeManager: SearchableEntityManager<ItemType, string>) => Promise<T>
    ): Promise<T> {
        if (!this.itemTypeManager) {
            throw new Error("itemTypeManager field is missing!");
        }

        return executable(this.itemTypeManager);
    }

    private async useOrderItemManager<T>(
        executable: (orderItemManager: EntityManager<OrderItem, OrderItemPrimaryKey>) => Promise<T>
    ): Promise<T> {
        if (!this.orderItemManager) {
            throw new Error("orderItemManager field is missing!");
        }

        return executable(this.orderItemManager);
    }

    private async useOrderManager<T>(
        executable: (orderManager: SearchableEntityManager<Order, string>) => Promise<T>
    ): Promise<T> {
        if (!this.orderManager) {
            throw new Error("orderManager field is missing!");
        }

        return executable(this.orderManager);
    }

    private async useUserManager<T>(
        executable: (userManager: SearchableEntityManager<User, string>) => Promise<T>
    ): Promise<T> {
        if (!this.userManager) {
            throw new Error("userManager field is missing!");
        }

        return executable(this.userManager);
    }

    private async useVerificationCodeManager<T>(
        executable: (verificationCodeManager: EntityManager<VerificationCode, VerificationCodePrimaryKey>) => Promise<T>
    ): Promise<T> {
        if (!this.verificationCodeManager) {
            throw new Error("verificationCodeManager field is missing!");
        }

        return executable(this.verificationCodeManager);
    }

    private useFileHandler<T>(
        executable: (fileHandler: FileHandler) => T
    ): T {
        if (!this.fileHandler) {
            throw new Error("fileHandler field is missing!");
        }

        return executable(this.fileHandler);
    }

    private useOrderHandler<T>(
        executable: (orderHandler: OrderHandler) => Promise<T>
    ): Promise<T> {
        if (!this.orderHandler) {
            throw new Error("orderHandler field is missing!");
        }

        return executable(this.orderHandler);
    }

    // Methods:
    public async getCartItem(pKey: CartItemPrimaryKey, path: any[]): Promise<CartItem | undefined> {
        return this.useCartItemManager(
            async function (cartItemManager) {
                return cartItemManager.get(pKey, path);
            }
        );
    }

    public async getAllCartItems(path: any[]): Promise<CartItem[]> {
        return this.useCartItemManager(
            async function (cartItemManager) {
                return cartItemManager.getAll(path);
            }
        );
    }

    public async getCartItemsByFilter(filter: any, path: any[]): Promise<CartItem[]> {
        return this.useCartItemManager(
            async function (cartItemManager) {
                return cartItemManager.getByFilter(filter, path);
            }
        )
    }

    public async insertCartItem(target: CartItem): Promise<void> {
        return this.useCartItemManager(
            async function (cartItemManager) {
                return cartItemManager.insert(target);
            }
        )
    }

    public async updateCartItem(target: CartItem): Promise<void> {
        return this.useCartItemManager(
            async function (cartItemManager) {
                return cartItemManager.update(target);
            }
        );
    }

    public async removeCartItem(target: CartItem): Promise<void> {
        return this.useCartItemManager(
            async function (cartItemManager) {
                return cartItemManager.remove(target);
            }
        )
    }

    public async removeCartItemByPrimaryKey(pKey: CartItemPrimaryKey): Promise<void> {
        return this.useCartItemManager(
            async function (cartItemManager) {
                return cartItemManager.removeByPrimaryKey(pKey);
            }
        );
    }

    getCartItemsByFilterFunc(filterFunc: (target: CartItem) => boolean | Promise<boolean>): Promise<CartItem[]> {
        throw new Error("Method not implemented.");
    }

    public async getItemImage(pKey: ItemImagePrimaryKey, path: any[]): Promise<ItemImage | undefined> {
        return this.useItemImageManager(
            async function (itemImageManager) {
                return itemImageManager.get(pKey, path);
            }
        );
    }

    public async getAllItemImages(path: any[]): Promise<ItemImage[]> {
        return this.useItemImageManager(
            async function (itemImageManager) {
                return itemImageManager.getAll(path);
            }
        );
    }

    public async getItemImagesByFilter(filter: any, path: any[]): Promise<ItemImage[]> {
        return this.useItemImageManager(
            async function (itemImageManager) {
                return itemImageManager.getByFilter(filter, path);
            }
        );
    }

    public async insertItemImage(target: ItemImage): Promise<void> {
        return this.useItemImageManager(
            async function (itemImageManager) {
                return itemImageManager.insert(target);
            }
        );
    }

    public async updateItemImage(target: ItemImage): Promise<void> {
        return this.useItemImageManager(
            async function (itemImageManager) {
                return itemImageManager.update(target);
            }
        );
    }
    public async removeItemImage(target: ItemImage): Promise<void> {
        return this.useItemImageManager(
            async function (itemImageManager) {
                return itemImageManager.remove(target);
            }
        );
    }

    public async removeItemImageByPrimaryKey(pKey: ItemImagePrimaryKey): Promise<void> {
        return this.useItemImageManager(
            async function (itemImageManager) {
                return itemImageManager.removeByPrimaryKey(pKey);
            }
        );
    }

    public async getItemType(pKey: string, path: any[]): Promise<ItemType | undefined> {
        return this.useItemTypeManager(
            async function (itemTypeManager) {
                return itemTypeManager.get(pKey, path);
            }
        );
    }

    public async getAllItemTypes(path: any[]): Promise<ItemType[]> {
        return this.useItemTypeManager(
            async function (itemTypeManager) {
                return itemTypeManager.getAll(path);
            }
        );
    }

    public async getItemTypesByFilter(filter: any, path: any[]): Promise<ItemType[]> {
        return this.useItemTypeManager(
            async function (itemTypeManager) {
                return itemTypeManager.getByFilter(filter, path);
            }
        );
    }

    public async insertItemType(target: ItemType): Promise<void> {
        return this.useItemTypeManager(
            async function (itemTypeManager) {
                return itemTypeManager.insert(target);
            }
        );
    }

    public async updateItemType(target: ItemType): Promise<void> {
        return this.useItemTypeManager(
            async function (itemTypeManager) {
                return itemTypeManager.update(target);
            }
        );
    }

    public async removeItemType(target: ItemType): Promise<void> {
        return this.useItemTypeManager(
            async function (itemTypeManager) {
                return itemTypeManager.remove(target);
            }
        );
    }

    public async removeItemTypeByPrimaryKey(pKey: string): Promise<void> {
        return this.useItemTypeManager(
            async function (itemTypeManager) {
                return itemTypeManager.removeByPrimaryKey(pKey);
            }
        );
    }

    public async getItemTypesByFilterFunc(filterFunc: (target: ItemType) => boolean | Promise<boolean>): Promise<ItemType[]> {
        return this.useItemTypeManager(
            async function (itemtypeManager) {
                return itemtypeManager.getByFilterFunc(filterFunc);
            }
        );
    }

    public async searchItemTypes(keyword: string): Promise<ItemType[]> {
        return this.useItemTypeManager(
            async function (itemTypeManager) {
                return itemTypeManager.search(keyword);
            }
        );
        
    }

    public async getBrand(pKey: string, path: any[]): Promise<Brand | undefined> {
        return this.useBrandManager(
            async function (brandManager) {
                return brandManager.get(pKey, path);
            }
        );
    }

    public async getAllBrands(path: any[]): Promise<Brand[]> {
        return this.useBrandManager(
            async function (brandManager) {
                return brandManager.getAll(path);
            }
        );
    }

    public async getBrandsByFilter(filter: any, path: any[]): Promise<Brand[]> {
        return this.useBrandManager(
            async function (brandManager) {
                return brandManager.getByFilter(filter, path);
            }
        );
    }

    public async insertBrand(target: Brand): Promise<void> {
        return this.useBrandManager(
            async function (brandManager) {
                return brandManager.insert(target);
            }
        );
    }

    public async updateBrand(target: Brand): Promise<void> {
        return this.useBrandManager(
            async function (brandManager) {
                return brandManager.update(target);
            }
        );
    }

    public async removeBrand(target: Brand): Promise<void> {
        return this.useBrandManager(
            async function (brandManager) {
                return brandManager.remove(target);
            }
        );
    }

    public async removeBrandByPrimaryKey(pKey: string): Promise<void> {
        return this.useBrandManager(
            async function (brandManager) {
                return brandManager.removeByPrimaryKey(pKey);
            }
        );
    }

    public async getBrandsByFilterFunc(filterFunc: (target: Brand) => boolean | Promise<boolean>): Promise<Brand[]> {
       return this.useBrandManager(
            async function (brandManager) {
                return brandManager.getByFilterFunc(filterFunc);
            }
       );
    }
    public async searchBrands(keyword: string): Promise<Brand[]> {
        return this.useBrandManager(
            async function (brandManager) {
                return brandManager.search(keyword);
            }
        );
    }

    public async getUser(pKey: string, path: any[]): Promise<User | undefined> {
        return this.useUserManager(
            async function (userManager) {
                return userManager.get(pKey, path);
            }
        );
    }

    public async getAllUsers(path: any[]): Promise<User[]> {
        return this.useUserManager(
            async function (userManager) {
                return userManager.getAll(path);
            }
        );
    }

    public async getUsersByFilter(filter: any, path: any[]): Promise<User[]> {
        return this.useUserManager(
            async function (userManager) {
                return userManager.getByFilter(filter, path);
            }
        );
    }

    public async insertUser(target: User): Promise<void> {
        return this.useUserManager(
            async function (userManager) {
                return userManager.insert(target);
            }
        );
    }

    public async updateUser(target: User): Promise<void> {
        return this.useUserManager(
            async function (userManager) {
                return userManager.update(target);
            }
        );
    }

    public async removeUser(target: User): Promise<void> {
        return this.useUserManager(
            async function (userManager) {
                return userManager.remove(target);
            }
        );
    }

    public async removeUserByPrimaryKey(pKey: string): Promise<void> {
        return this.useUserManager(
            async function (userManager) {
                return userManager.removeByPrimaryKey(pKey);
            }
        );
    }

    public async getUsersByFilterFunc(filterFunc: (target: User) => boolean | Promise<boolean>): Promise<User[]> {
        return this.useUserManager(
            async function (userManager) {
                return userManager.getByFilterFunc(filterFunc);
            }
        )
    }
    public async searchUsers(keyword: string): Promise<User[]> {
        return this.useUserManager(
            async function (userManager) {
                return userManager.search(keyword);
            }
        )
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

    public async getItemsByFilterFunc(filterFunc: (target: Item) => boolean | Promise<boolean>): Promise<Item[]> {
        return this.useItemManager(
            async function (itemManager) {
                return itemManager.getByFilterFunc(filterFunc);
            }
        );
    }

    public async searchItems(keyword: string): Promise<Item[]> {
        return this.useItemManager(
            async function (itemManager) {
                return itemManager.search(keyword);
            }
        );
    }

    public async getOrder(pKey: string, path: any[]): Promise<Order | undefined> {
        return this.useOrderManager(
            async function (orderManager) {
                return orderManager.get(pKey, path);
            }
        );
    }

    public async getAllOrders(path: any[]): Promise<Order[]> {
        return this.useOrderManager(
            async function (orderManager) {
                return orderManager.getAll(path);
            }
        );
    }

    public async getOrdersByFilter(filter: any, path: any[]): Promise<Order[]> {
        return this.useOrderManager(
            async function (orderManager) {
                return orderManager.getByFilter(filter, path);
            }
        );
    }

    public async insertOrder(target: Order): Promise<void> {
        return this.useOrderManager(
            async function (orderManager) {
                return orderManager.insert(target);
            }
        );
    }

    public async updateOrder(target: Order): Promise<void> {
        return this.useOrderManager(
            async function (orderManager) {
                return orderManager.update(target);
            }
        );
    }

    public async removeOrder(target: Order): Promise<void> {
        return this.useOrderManager(
            async function (orderManager) {
                return orderManager.remove(target);
            }
        );
    }

    public async removeOrderByPrimaryKey(pKey: string): Promise<void> {
        return this.useOrderManager(
            async function (orderManager) {
                return orderManager.removeByPrimaryKey(pKey);
            }
        );
    }

    getOrdersByFilterFunc(filterFunc: (target: Order) => boolean | Promise<boolean>): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }
    public async searchOrders(keyword: string): Promise<Order[]> {
        return this.useOrderManager(
            async function (orderManager) {
                return orderManager.search(keyword); 
            }
        )
    }

    public async getOrderItem(pKey: OrderItemPrimaryKey, path: any[]): Promise<OrderItem | undefined> {
        return this.useOrderItemManager(
            async function (orderItemManager) {
                return orderItemManager.get(pKey, path);
            }
        );
    }

    public async getAllOrderItems(path: any[]): Promise<OrderItem[]> {
        return this.useOrderItemManager(
            async function (orderItemManager) {
                return orderItemManager.getAll(path);
            }
        );
    }

    public async getOrderItemsByFilter(filter: any, path: any[]): Promise<OrderItem[]> {
        return this.useOrderItemManager(
            async function (orderItemManager) {
                return orderItemManager.getByFilter(filter, path);
            }
        );
    }

    public async insertOrderItem(target: OrderItem): Promise<void> {
        return this.useOrderItemManager(
            async function (orderItemManager) {
                return orderItemManager.insert(target);
            }
        );
    }

    public async updateOrderItem(target: OrderItem): Promise<void> {
        return this.useOrderItemManager(
            async function (orderItemManager) {
                return orderItemManager.update(target);
            }
        );
    }

    public async removeOrderItem(target: OrderItem): Promise<void> {
        return this.useOrderItemManager(
            async function (orderItemManager) {
                return orderItemManager.remove(target);
            }
        )
    }

    public async removeOrderItemByPrimaryKey(pKey: OrderItemPrimaryKey): Promise<void> {
        return this.useOrderItemManager(
            async function (orderItemManager) {
                return orderItemManager.removeByPrimaryKey(pKey);
            }
        );
    }

    public async getVerificationCode(pKey: VerificationCodePrimaryKey, path: any[]): Promise<VerificationCode | undefined> {
        return this.useVerificationCodeManager(
            async function (verificationCodeManager) {
                return verificationCodeManager.get(pKey, path);
            }
        );
    }

    public async getAllVerificationCodes(path: any[]): Promise<VerificationCode[]> {
        return this.useVerificationCodeManager(
            async function (verificationCodeManager) {
                return verificationCodeManager.getAll(path);
            }
        );
    }

    public async getVerificationCodesByFilter(filter: any, path: any[]): Promise<VerificationCode[]> {
        return this.useVerificationCodeManager(
            async function (verificationCodeManager) {
                return verificationCodeManager.getByFilter(filter, path);
            }
        );
    }

    public async insertVerificationCode(target: VerificationCode): Promise<void> {
        return this.useVerificationCodeManager(
            async function (verificationCodeManager) {
                return verificationCodeManager.insert(target);
            }
        )
    }

    public async updateVerificationCode(target: VerificationCode): Promise<void> {
        return this.useVerificationCodeManager(
            async function (verificationCodeManager) {
                return verificationCodeManager.update(target);
            }
        );
    }

    public async removeVerificationCode(target: VerificationCode): Promise<void> {
        return this.useVerificationCodeManager(
            async function (verificationCodeManager) {
                return verificationCodeManager.remove(target);
            }
        );
    }

    public async removeVerificationCodeByPrimaryKey(pKey: VerificationCodePrimaryKey): Promise<void> {
        return this.useVerificationCodeManager(
            async function (verificationCodeManager) {
                return verificationCodeManager.removeByPrimaryKey(pKey);
            }
        );
    }

    public writeFileAutoName(path: string, file: Express.Multer.File): string {
        return this.useFileHandler(
            fileHandler => fileHandler.writeAutoName(path, file)
        );
    }

    public deleteFile(path: string): void {
        return this.useFileHandler(
            fileHandler => fileHandler.delete(path)
        );
    }

    public isImageFile(file: Express.Multer.File): boolean {
        return this.useFileHandler(
            fileHandler => fileHandler.isImageFile(file)
        );
    }

    public getFileNameFromPath(path: string): string {
        return this.useFileHandler(
            fileHandler => fileHandler.getFileNameFromPath(path)
        );
    }

    public async newOrder(param: OrderHandlerParam): Promise<void> {
        return this.useOrderHandler(
            async orderHandler => orderHandler.newOrder(param)
        );
    }

    public async cancelOrder(order: Order): Promise<void> {
        return this.useOrderHandler(
            async orderHandler => orderHandler.cancelOrder(order)
        );
    }

    // Getters / setters:
    public get BrandManager(): SearchableEntityManager<Brand, string> | undefined {
        return this.brandManager;
    }

    public set BrandManager(value: SearchableEntityManager<Brand, string> | undefined) {
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

    public get ItemManager(): SearchableEntityManager<Item, string> | undefined {
        return this.itemManager;
    }

    public set ItemManager(value: SearchableEntityManager<Item, string> | undefined) {
        this.itemManager = value;
    }

    public get ItemTypeManager(): SearchableEntityManager<ItemType, string> | undefined {
        return this.itemTypeManager;
    }

    public set ItemTypeManager(value: SearchableEntityManager<ItemType, string> | undefined) {
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
    public set OrderManager(value: SearchableEntityManager<Order, string> | undefined) {
        this.orderManager = value;
    }

    public get UserManager(): EntityManager<User, string> | undefined {
        return this.userManager;
    }

    public set UserManager(value: SearchableEntityManager<User, string> | undefined) {
        this.userManager = value;
    }

    public get VerificationCodeManager(): EntityManager<VerificationCode, VerificationCodePrimaryKey> | undefined {
        return this.verificationCodeManager;
    }
    
    public set VerificationCodeManager(value: EntityManager<VerificationCode, VerificationCodePrimaryKey> | undefined) {
        this.verificationCodeManager = value;
    }

    public get  OrderHandler() {
        return this.orderHandler;
    }

    public set OrderHandler(value) {
        this.orderHandler = value;
    }
}