import BrandDBHandler from "./persistence/BrandDBHandler";
import CartItemDBHandler from "./persistence/CartItemDBHandler";
import ItemDBHandler from "./persistence/ItemDBHandler";
import ItemImageDBHandler from "./persistence/ItemImageDBHandler";
import ItemTypeDBHandler from "./persistence/ItemTypeDBHandler";
import OrderDBHandler from "./persistence/OrderDBHandler";
import OrderItemDBHandler from "./persistence/OrderItemDBHandler";
import UserDBHandler from "./persistence/UserDBHandler";
import VerificationCodeDBHandler from "./persistence/VerificationCodeDBHandler";
import BrandDataConverter from "./persistence/converters/BrandDataConverter";
import CartItemDataConverter from "./persistence/converters/CartItemDataConverter";
import ItemDataConverter from "./persistence/converters/ItemDataConverter";
import ItemImageDataConverter from "./persistence/converters/ItemImageDataConverter";
import ItemTypeDataConverter from "./persistence/converters/ItemTypeDataConverter";
import OrderDataConverter from "./persistence/converters/OrderDataConverter";
import OrderItemDataConverter from "./persistence/converters/OrderItemDataConverter";
import UserDataConverter from "./persistence/converters/UserDataConverter";
import VerificationCodeDataConverter from "./persistence/converters/VerificationCodeDataConverter";

const objectsDeclaration = [
    {
        prototype: CartItemDataConverter.prototype,
        name: "cartItemDataConverter"
    },

    {
        prototype: CartItemDBHandler.prototype,
        name: "cartItemDBHandler",
        dependencies: [
            [ "cartItemDataConverter", "cartItemDataConverter" ]
        ]
    },

    {
        prototype: ItemImageDataConverter.prototype,
        name: "itemImageDataConverter"
    },

    {
        prototype: ItemImageDBHandler.prototype,
        name: "itemImageDBHandler",
        dependencies: [
            [ "itemImageDataConverter", "itemImageDataConverter" ]
        ]
    },

    {
        prototype: ItemTypeDataConverter.prototype,
        name: "itemTypeDataConverter"
    },

    {
        prototype: ItemTypeDBHandler.prototype,
        name: "itemTypeDBHandler",
        dependencies: [
            [ "itemTypeConverter", "itemTypeDataConverter" ]
        ]
    },

    {
        prototype: BrandDataConverter.prototype,
        name: "brandDataConverter"
    },

    {
        prototype: BrandDBHandler.prototype,
        name: "brandDBHandler",
        dependencies: [
            [ "brandDataConverter", "brandDataConverter" ]
        ]
    },

    {
        prototype: UserDataConverter.prototype,
        name: "userDataConverter"
    },

    {
        prototype: UserDBHandler.prototype,
        name: "userDBHandler",
        dependencies: [
            [ "userDataConverter", "userDataConverter" ]
        ]
    },

    {
        prototype: ItemDataConverter.prototype,
        name: "itemDataConverter"
    },

    {
        prototype: ItemDBHandler.prototype,
        name: "itemDBHandler",
        dependencies: [
            [ "itemDataConverter", "itemDataConverter" ]
        ]
    },

    {
        prototype: OrderDataConverter.prototype,
        name: "orderDataConverter"
    },

    {
        prototype: OrderDBHandler.prototype,
        name: "orderDBHandler",
        dependencies: [
            [ "OrderDataConverter", "orderDataConverter" ]
        ]
    },

    {
        prototype: OrderItemDataConverter.prototype,
        name: "orderItemDataConverter"
    },

    {
        prototype: OrderItemDBHandler.prototype,
        name: "orderItemDBHandler",
        dependencies: [
            [ "orderItemDataConverter", "orderItemDataConverter" ]
        ]
    },

    {
        prototype: VerificationCodeDataConverter.prototype,
        name: "verificationCodeDataConverter"
    },

    {
        prototype: VerificationCodeDBHandler.prototype,
        name: "verificationCodeDBHandler",
        dependencies: [
            [ "converter", "verificationCodeDataConverter" ]
        ]
    }
];

export default objectsDeclaration;