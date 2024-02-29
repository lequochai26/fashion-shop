import CartItemPrimaryKey from "../persistence/pkeys/CartItemPrimaryKey"
import CartItem from "./entities/CartItem"
import ItemImagePrimaryKey from "../persistence/pkeys/ItemImagePrimaryKey"
import ItemImage from "./entities/ItemImage"
import ItemType from "./entities/ItemType"
import Brand from "./entities/Brand"
import User from "./entities/User"
import Item from "./entities/Item"
import Order from "./entities/Order"
import OrderItemPrimaryKey from "../persistence/pkeys/OrderItemPrimaryKey"
import OrderItem from "./entities/OrderItem"
import VerificationCodePrimaryKey from "../persistence/pkeys/VerificationCodePrimaryKey"
import VerificationCode from "./entities/VerificationCode"

export default interface DomainManager {
    getCartItem(pKey: CartItemPrimaryKey, path: any[]): Promise<CartItem | undefined>
    getAllCartItems(path: any[]): Promise<CartItem[]>
    getCartItemsByFilter(filter: any, path: any[]): Promise<CartItem[]>
    insertCartItem(target: CartItem): Promise<void>
    updateCartItem(target: CartItem): Promise<void>
    removeCartItem(target: CartItem): Promise<void>
    removeCartItemByPrimaryKey(pKey: CartItemPrimaryKey): Promise<void>
    getCartItemsByFilterFunc(filterFunc: (target: CartItem) => boolean): Promise<CartItem[]>

    getItemImage(pKey: ItemImagePrimaryKey, path: any[]): Promise<ItemImage | undefined>
    getAllItemImages(path: any[]): Promise<ItemImage[]>
    getItemImagesByFilter(filter: any, path: any[]): Promise<ItemImage[]>
    insertItemImage(target: ItemImage): Promise<void>
    updateItemImage(target: ItemImage): Promise<void>
    removeItemImage(target: ItemImage): Promise<void>
    removeItemImageByPrimaryKey(pKey: ItemImagePrimaryKey): Promise<void>

    getItemType(pKey: string, path: any[]): Promise<ItemType | undefined>
    getAllItemTypes(path: any[]): Promise<ItemType[]>
    getItemTypesByFilter(filter: any, path: any[]): Promise<ItemType[]>
    insertItemType(target: ItemType): Promise<void>
    updateItemType(target: ItemType): Promise<void>
    removeItemType(target: ItemType): Promise<void>
    removeItemTypeByPrimaryKey(pKey: string): Promise<void>
    getItemTypesByFilterFunc(filterFunc: (target: ItemType) => boolean): Promise<ItemType[]>
    searchItemTypes(pKey: string): Promise<ItemType[]>

    getBrand(pKey: string, path: any[]): Promise<Brand | undefined>
    getAllBrands(path: any[]): Promise<Brand[]>
    getBrandsByFilter(filter: any, path: any[]): Promise<Brand[]>
    insertBrand(target: Brand): Promise<void>
    updateBrand(target: Brand): Promise<void>
    removeBrand(target: Brand): Promise<void>
    removeBrandByPrimaryKey(pKey: string): Promise<void>
    getBrandsByFilterFunc(filterFunc: (target: Brand) => boolean): Promise<Brand[]>
    searchBrands(pKey: string): Promise<Brand[]>

    getUser(pKey: string, path: any[]): Promise<User | undefined>
    getAllUsers(path: any[]): Promise<User[]>
    getUsersByFilter(filter: any, path: any[]): Promise<User[]>
    insertUser(target: User): Promise<void>
    updateUser(target: User): Promise<void>
    removeUser(target: User): Promise<void>
    removeUserByPrimaryKey(pKey: string): Promise<void>
    getUsersByFilterFunc(filterFunc: (target: User) => boolean): Promise<User[]>
    searchUsers(pKey: string): Promise<User[]>

    getItem(pKey: string, path: any[]): Promise<Item | undefined>
    getAllItems(path: any[]): Promise<Item[]>
    getItemsByFilter(filter: any, path: any[]): Promise<Item[]>
    insertItem(target: Item): Promise<void>
    updateItem(target: Item): Promise<void>
    removeItem(target: Item): Promise<void>
    removeItemByPrimaryKey(pKey: string): Promise<void>
    getItemsByFilterFunc(filterFunc: (target: Item) => boolean): Promise<Item[]>
    searchItems(pKey: string): Promise<Item[]>

    getOrder(pKey: string, path: any[]): Promise<Order | undefined>
    getAllOrders(path: any[]): Promise<Order[]>
    getOrdersByFilter(filter: any, path: any[]): Promise<Order[]>
    insertOrder(target: Order): Promise<void>
    updateOrder(target: Order): Promise<void>
    removeOrder(target: Order): Promise<void>
    removeOrderByPrimaryKey(pKey: string): Promise<void>
    getOrdersByFilterFunc(filterFunc: (target: Order) => boolean): Promise<Order[]>
    searchOrders(pKey: string): Promise<Order[]>

    getOrderItem(pKey: OrderItemPrimaryKey, path: any[]): Promise<OrderItem | undefined>
    getAllOrderItems(path: any[]): Promise<OrderItem[]>
    getOrderItemsByFilter(filter: any, path: any[]): Promise<OrderItem[]>
    insertOrderItem(target: OrderItem): Promise<void>
    updateOrderItem(target: OrderItem): Promise<void>
    removeOrderItem(target: OrderItem): Promise<void>
    removeOrderItemByPrimaryKey(pKey: OrderItemPrimaryKey): Promise<void>

    getVerificationCode(pKey: VerificationCodePrimaryKey, path: any[]): Promise<VerificationCode | undefined>
    getAllVerificationCodes(path: any[]): Promise<VerificationCode[]>
    getVerificationCodesByFilter(filter: any, path: any[]): Promise<VerificationCode[]>
    insertVerificationCode(target: VerificationCode): Promise<void>
    updateVerificationCode(target: VerificationCode): Promise<void>
    removeVerificationCode(target: VerificationCode): Promise<void>
    removeVerificationCodeByPrimaryKey(pKey: VerificationCodePrimaryKey): Promise<void>
}