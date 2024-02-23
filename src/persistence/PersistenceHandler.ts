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

export default interface PersistenceHandler {
    // CartItem Handle Methods
    getCartItem(pKey: CartItemPrimaryKey): Promise<CartItemData | undefined>;
    getAllCartItems(): Promise<CartItemData[]>
    getCartItemsByFilter(filter: any): Promise<CartItemData[]>
    insertCartItem(target: CartItemData): Promise<void>
    updateCartItem(target: CartItemData): Promise<void>
    removeCartItem(target: CartItemData): Promise<void>
    removeCartItemByPrimaryKey(pKey: CartItemPrimaryKey): Promise<void>

    // ItemImage Handle Methods
    getItemImage(pKey: ItemImagePrimaryKey): Promise<ItemImageData | undefined>
    getAllItemImages(): Promise<ItemImageData[]>
    getItemImagesByFilter(filter: any): Promise<ItemImageData[]>
    insertItemImage(target: ItemImageData): Promise<void>
    updateItemImage(target: ItemImageData): Promise<void>
    removeItemImage(target: ItemImageData): Promise<void>
    removeItemImageByPrimaryKey(pKey: ItemImagePrimaryKey): Promise<void>

    // ItemType Handle Methods
    getItemType(pKey: string): Promise<ItemTypeData | undefined>
    getAllItemTypes(): Promise<ItemTypeData[]>
    getItemTypesByFilter(filter: any): Promise<ItemTypeData[]>
    insertItemType(target: ItemTypeData): Promise<void>
    updateItemType(target: ItemTypeData): Promise<void>
    removeItemType(target: ItemTypeData): Promise<void>
    removeItemTypeByPrimaryKey(pKey: string): Promise<void>

    // Brand Handle Methods
    getBrand(pKey:string): Promise<BrandData | undefined>
    getAllBrands(): Promise<BrandData[]>
    getBrandsByFilter(filter:any): Promise<BrandData[]>
    insertBrand(target:BrandData): Promise<void>
    updateBrand(target:BrandData): Promise<void>
    removeBrand(target:BrandData): Promise<void>
    removeBrandByPrimaryKey(pKey:string): Promise<void>

    // User Handle Methods
    getUser(pKey: string): Promise<UserData | undefined>
    getAllUsers(): Promise<UserData[]>
    getUsersByFilter(filter: any): Promise<UserData[]>
    insertUser(target: UserData): Promise<void>
    updateUser(target:UserData): Promise<void>
    removeUser(target:UserData): Promise<void>
    removeUserByPrimaryKey(pKey: string): Promise<void>

    // Item Handle Methods
    getItem(pKey: string): Promise<ItemData | undefined>
    getAllItems(): Promise<ItemData[]>
    getItemsByFilter(filter: any): Promise<ItemData[]>
    insertItem(target: ItemData): Promise<void>
    updateItem(target: ItemData): Promise<void>
    removeItem(target: ItemData): Promise<void>
    removeItemByPrimaryKey(pKey: string): Promise<void>

    // Order Handle Methods
    getOrder(pKey: string): Promise<OrderData | undefined>
    getAllOrders(): Promise<OrderData[]>
    getOrdersByFilter(filter: any): Promise<OrderData[]>
    insertOrder(target: OrderData): Promise<void>
    updateOrder(target:OrderData): Promise<void>
    removeOrder(target:OrderData): Promise<void>
    removeOrderByPrimaryKey(pKey: string): Promise<void>

    // OrderItem Handle Methods
    getOrderItem(pKey: OrderItemPrimaryKey): Promise<OrderItemData | undefined>
    getAllOrderItems(): Promise<OrderItemData[]>
    getOrderItemsByFilter(filter: any): Promise<OrderItemData[]>
    insertOrderItem(target: OrderItemData): Promise<void>
    updateOrderItem(target: OrderItemData): Promise<void>
    removeOrderItem(target: OrderItemData): Promise<void>
    removeOrderItemByPrimaryKey(pKey: OrderItemPrimaryKey): Promise<void>

    // VerificationCode Handle Methods
    getVerificationCode(pKey: VerificationCodePrimaryKey): Promise<VerificationCodeData | undefined>
    getAllVerificationCodes(): Promise<VerificationCodeData[]>
    getVerificationCodesByFilter(filter: any): Promise<VerificationCodeData[]>
    insertVerificationCode(target: VerificationCodeData): Promise<void>
    updateVerificationCode(target: VerificationCodeData): Promise<void>
    removeVerificationCode(target: VerificationCodeData): Promise<void>
    removeVerificationCodeByPrimaryKey(pKey: VerificationCodePrimaryKey): Promise<void>
}