import ItemRestfulApi from "../boundary/ItemRestfulApi";
import BrandDBHandler from "../persistence/BrandDBHandler";
import CartItemDBHandler from "../persistence/CartItemDBHandler";
import ItemDBHandler from "../persistence/ItemDBHandler";
import ItemImageDBHandler from "../persistence/ItemImageDBHandler";
import ItemTypeDBHandler from "../persistence/ItemTypeDBHandler";
import OrderDBHandler from "../persistence/OrderDBHandler";
import OrderItemDBHandler from "../persistence/OrderItemDBHandler";
import PersistenceHandlerImpl from "../persistence/PersistenceHandlerImpl";
import UserDBHandler from "../persistence/UserDBHandler";
import VerificationCodeDBHandler from "../persistence/VerificationCodeDBHandler";
import BrandDataConverter from "../persistence/converters/BrandDataConverter";
import CartItemDataConverter from "../persistence/converters/CartItemDataConverter";
import ItemDataConverter from "../persistence/converters/ItemDataConverter";
import ItemImageDataConverter from "../persistence/converters/ItemImageDataConverter";
import ItemTypeDataConverter from "../persistence/converters/ItemTypeDataConverter";
import OrderDataConverter from "../persistence/converters/OrderDataConverter";
import OrderItemDataConverter from "../persistence/converters/OrderItemDataConverter";
import UserDataConverter from "../persistence/converters/UserDataConverter";
import VerificationCodeDataConverter from "../persistence/converters/VerificationCodeDataConverter";

const objectsDeclaration = [
    // cartItemDataConverter
    {
        prototype: CartItemDataConverter.prototype,
        name: "cartItemDataConverter"
    },

    // cartItemDBHandler
    {
        prototype: CartItemDBHandler.prototype,
        name: "cartItemDBHandler",
        dependencies: [
            [ "cartItemDataConverter", "cartItemDataConverter" ]
        ]
    },

    // itemImageDataConverter
    {
        prototype: ItemImageDataConverter.prototype,
        name: "itemImageDataConverter"
    },

    // itemImageDBHandler
    {
        prototype: ItemImageDBHandler.prototype,
        name: "itemImageDBHandler",
        dependencies: [
            [ "itemImageDataConverter", "itemImageDataConverter" ]
        ]
    },

    // itemTypeDataConverter
    {
        prototype: ItemTypeDataConverter.prototype,
        name: "itemTypeDataConverter"
    },

    // itemTypeDBHandler
    {
        prototype: ItemTypeDBHandler.prototype,
        name: "itemTypeDBHandler",
        dependencies: [
            [ "itemTypeDataConverter", "itemTypeDataConverter" ]
        ]
    },

    // brandDataConverter
    {
        prototype: BrandDataConverter.prototype,
        name: "brandDataConverter"
    },

    // brandDBHandler
    {
        prototype: BrandDBHandler.prototype,
        name: "brandDBHandler",
        dependencies: [
            [ "brandDataConverter", "brandDataConverter" ]
        ]
    },

    // userDataConverter
    {
        prototype: UserDataConverter.prototype,
        name: "userDataConverter"
    },

    // userDBHandler
    {
        prototype: UserDBHandler.prototype,
        name: "userDBHandler",
        dependencies: [
            [ "userDataConverter", "userDataConverter" ]
        ]
    },

    // itemDataConverter
    {
        prototype: ItemDataConverter.prototype,
        name: "itemDataConverter"
    },

    // itemDBHandler
    {
        prototype: ItemDBHandler.prototype,
        name: "itemDBHandler",
        dependencies: [
            [ "itemDataConverter", "itemDataConverter" ]
        ]
    },

    // orderDataConverter
    {
        prototype: OrderDataConverter.prototype,
        name: "orderDataConverter"
    },

    // orderDBHandler
    {
        prototype: OrderDBHandler.prototype,
        name: "orderDBHandler",
        dependencies: [
            [ "orderDataConverter", "orderDataConverter" ]
        ]
    },

    // orderItemDataConverter
    {
        prototype: OrderItemDataConverter.prototype,
        name: "orderItemDataConverter"
    },

    // orderItemDBHandler
    {
        prototype: OrderItemDBHandler.prototype,
        name: "orderItemDBHandler",
        dependencies: [
            [ "orderItemDataConverter", "orderItemDataConverter" ]
        ]
    },

    // verificationCodeDataConverter
    {
        prototype: VerificationCodeDataConverter.prototype,
        name: "verificationCodeDataConverter"
    },

    // verificationCodeDBHandler
    {
        prototype: VerificationCodeDBHandler.prototype,
        name: "verificationCodeDBHandler",
        dependencies: [
            [ "converter", "verificationCodeDataConverter" ]
        ]
    },

    // persistenceHandler
    {
        prototype: PersistenceHandlerImpl.prototype,
        name: "persistenceHandler",
        dependencies: [
            [ "brandDBHandler", "brandDBHandler" ],
            [ "cartItemDBHandler", "cartItemDBHandler" ],
            [ "itemDBHandler", "itemDBHandler" ],
            [ "itemImageDBHandler", "itemImageDBHandler" ],
            [ "itemTypeDBHandler", "itemTypeDBHandler" ],
            [ "orderDBHandler", "orderDBHandler" ],
            [ "orderItemDBHandler", "orderItemDBHandler" ],
            [ "userDBHandler", "userDBHandler" ],
            [ "verificationCodeDBHandler", "verificationCodeDBHandler" ]
        ]
    },

    // itemRestfulApi
    {
        target: new ItemRestfulApi(),
        name: "itemRestfulApi",
        depenedencies: [
            [ "domainManager", "domainManager" ]
        ]
    }
];

export default objectsDeclaration;