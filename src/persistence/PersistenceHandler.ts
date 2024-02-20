import CartItemData from "./data/CartItemData";
import ItemImageData from "./data/ItemImageData";
import ItemTypeData from "./data/ItemTypeData";
import CartItemPrimaryKey from "./pkeys/CartItemPrimaryKey";
import ItemImagePrimaryKey from "./pkeys/ItemImagePrimaryKey";

export default interface PersistenceHandler {
    // Cart Item Handler
    getCartItem(pKey: CartItemPrimaryKey): Promise<CartItemData>;
    getAllCartItems(): Promise<CartItemData[]>
    getCartItemsByFilter(filter: any): Promise<CartItemData[]>
    insertCartItem(target: CartItemData): Promise<void>
    updateCartItem(target: CartItemData): Promise<void>
    removeCartItem(target: CartItemData): Promise<void>
    removeCartItemByPrimaryKey(pKey: CartItemPrimaryKey): Promise<void>

    // Item image
    getItemImage(pKey: ItemImagePrimaryKey): Promise<ItemImageData>
    getAllItemImages(): Promise<ItemImageData[]>
    getItemImagesByFilter(filter: any): Promise<ItemImageData[]>
    insertItemImage(target: ItemImageData): Promise<void>
    updateItemImage(target: ItemImageData): Promise<void>
    removeItemImage(target: ItemImageData): Promise<void>
    removeItemImageByPrimaryKey(pKey: ItemImagePrimaryKey): Promise<void>



getItemType(pKey: string): Promise<ItemTypeData>

getItemTypesAll(): Promise<ItemTypeData[]>

getItemTypesByFilter(filter: any): Promise<ItemTypeData[]>

insertItemType(target: ItemTypeData): Promise<void>

updateItemType(target: ItemTypeData): Promise<void>

removeItemType(target: ItemTypeData): Promise<void>

removeItemTypeByPrimaryKey(pKey: string): Promise<void>



+ getBrand(string): BrandData

+ getAllBrands(): BrandData[]

+ getBrandsByFilter(any): BrandData[]

+ insertBrand(BrandData): void

+ updateBrand(BrandData): void

+ removeBrand(BrandData): void

+ removeBrandByPrimaryKey(string): void



+ getUser(string): UserData

+ getAllUsers(): UserData[]

+ getUsersByFilter(any): UserData[]

+ insertUser(UserData): void

+ updateUser(UserData): void

+ removeUser(UserData): void

+ removeUserByPrimaryKey(string): void



+ getItem(string): ItemData

+ getAllItems(): ItemData[]

+ getItemsByFilter(any): ItemData[]

+ insertItem(ItemData): void

+ updateItem(ItemData): void

+ removeItem(ItemData): void

+ removeItemByPrimaryKey(string): void



+ getOrder(string): OrderData

+ getAllOrders(): OrderData[]

+ getOrdersByFilter(any): OrderData[]

+ insertOrder(OrderData): void

+ updateOrder(OrderData): void

+ removeOrder(OrderData): void

+ removeOrderByPrimaryKey(string): void



+ getOrderItem(OrderItemPrimaryKey): OrderItemData

+ getAllOrderItems(): OrderItemData[]

+ getOrderItemsByFilter(any): OrderItemData[]

+ insertOrderItem(OrderItemData): void

+ updateOrderItem(OrderItemData): void

+ removeOrderItem(OrderItemData): void

+ removeOrderItemByPrimaryKey(OrderItemPrimaryKey): void



+ getVerificationCode(VerificationCodePrimaryKey): VerificationCodeData

+ getAllVerificationCodes(): VerificationCodeData[]

+ getVerificationCodesByFilter(any): VerificationCodeData[]

+ insertVerificationCode(VerificationCodeData): void

+ updateVerificationCode(VerificationCodeData): void

+ removeVerificationCode(VerificationCodeData): void

+ removeVerificationCodeByPrimaryKey(VerificationCodePrimaryKey): void
}