import ImageRequestHandler from "../boundary/ImageRequestHandler";
import RequestHandler from "../boundary/interfaces/RequestHandler";
import BrandRestfulApi from "../boundary/upgrade/BrandRestfulApi";
import CartRestfulApi from "../boundary/upgrade/CartRestfulApi";
import ItemRestfulApi from "../boundary/upgrade/ItemRestfulApi";
import ItemTypeRestfulApi from "../boundary/upgrade/ItemTypeRestfulApi";
import OrderRestfulApi from "../boundary/upgrade/OrderRestfulApi";
import UserRestfulApi from "../boundary/upgrade/UserRestfulApi";
import BrandConverter from "../domain/converters/upgrade/BrandConverter";
import CartItemConverter from "../domain/converters/upgrade/CartItemConverter";
import ItemConverter from "../domain/converters/upgrade/ItemConverter";
import ItemImageConverter from "../domain/converters/upgrade/ItemImageConverter";
import ItemTypeConverter from "../domain/converters/upgrade/ItemTypeConverter";
import OrderConverter from "../domain/converters/upgrade/OrderConverter";
import OrderItemConverter from "../domain/converters/upgrade/OrderItemConverter";
import UserConverter from "../domain/converters/upgrade/UserConverter";
import VerificationCodeConverter from "../domain/converters/VerificationCodeConverter";
import FileHandler from "../domain/FileHandler";
import BrandManager from "../domain/upgrade/BrandManager";
import CartItemManager from "../domain/upgrade/CartItemManager";
import DomainManager from "../domain/upgrade/DomainManager";
import DomainManagerImpl from "../domain/upgrade/DomainManagerImpl";
import ItemImageManager from "../domain/upgrade/ItemImageManager";
import ItemManager from "../domain/upgrade/ItemManager";
import ItemTypeManager from "../domain/upgrade/ItemTypeManager";
import OrderHandler from "../domain/upgrade/OrderHandler";
import OrderItemManager from "../domain/upgrade/OrderItemManager";
import OrderManager from "../domain/upgrade/OrderManager";
import UserManager from "../domain/upgrade/UserManager";
import VerificationCodeManager from "../domain/VerificationCodeManager";
import BrandDBHandler from "../persistence/BrandDBHandler";
import CartItemDBHandler from "../persistence/CartItemDBHandler";
import BrandDataConverter from "../persistence/converters/BrandDataConverter";
import CartItemDataConverter from "../persistence/converters/CartItemDataConverter";
import ItemDataConverter from "../persistence/converters/ItemDataConverter";
import ItemImageDataConverter from "../persistence/converters/ItemImageDataConverter";
import ItemTypeDataConverter from "../persistence/converters/ItemTypeDataConverter";
import OrderDataConverter from "../persistence/converters/OrderDataConverter";
import OrderItemDataConverter from "../persistence/converters/OrderItemDataConverter";
import UserDataConverter from "../persistence/converters/UserDataConverter";
import VerificationCodeDataConverter from "../persistence/converters/VerificationCodeDataConverter";
import ItemDBHandler from "../persistence/ItemDBHandler";
import ItemImageDBHandler from "../persistence/ItemImageDBHandler";
import ItemTypeDBHandler from "../persistence/ItemTypeDBHandler";
import OrderDBHandler from "../persistence/OrderDBHandler";
import OrderItemDBHandler from "../persistence/OrderItemDBHandler";
import PersistenceHandlerImpl from "../persistence/PersistenceHandlerImpl";
import UserDBHandler from "../persistence/UserDBHandler";
import VerificationCodeDBHandler from "../persistence/VerificationCodeDBHandler";

const objectsDeclaration = [
    // PERSISTENCE LAYER
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

    // DOMAIN LAYER
    // brandManager
    {
        prototype: BrandManager.prototype,
        name: "brandManager",
        dependencies: [
            [ "persistenceHandler", "persistenceHandler" ],
            [ "brandConverter", "brandConverter" ],
            [ "itemManager", "itemManager" ]
        ]
    },

    // cartItemManager
    {
        prototype: CartItemManager.prototype,
        name: "cartItemManager",
        dependencies: [
            [ "persistenceHandler", "persistenceHandler" ],
            [ "cartItemConverter", "cartItemConverter" ],
            [ "userManager", "userManager" ],
            [ "itemManager", "itemManager" ]
        ]
    },

    // itemImageManager
    {
        prototype: ItemImageManager.prototype,
        name: "itemImageManager",
        dependencies: [
            [ "persistenceHandler", "persistenceHandler" ],
            [ "itemImageConverter", "itemImageConverter" ],
            [ "itemManager", "itemManager" ]
        ]
    },

    // itemManager
    {
        prototype: ItemManager.prototype,
        name: "itemManager",
        dependencies: [
            [ "persistenceHandler", "persistenceHandler" ],
            [ "itemConverter", "itemConverter" ],
            [ "itemTypeManager", "itemTypeManager" ],
            [ "brandManager", "brandManager" ],
            [ "itemImageManager", "itemImageManager" ],
            [ "orderItemManager", "orderItemManager" ],
            [ "cartItemManager", "cartItemManager"]
        ]
    },

    // itemTypeManager
    {
        prototype: ItemTypeManager.prototype,
        name: "itemTypeManager",
        dependencies: [
            [ "persistenceHandler", "persistenceHandler" ],
            [ "itemTypeConverter", "itemTypeConverter" ],
            [ "itemManager", "itemManager" ]
        ]
    },

    // orderItemManager
    {
        prototype: OrderItemManager.prototype,
        name: "orderItemManager",
        dependencies: [
            [ "persistenceHandler", "persistenceHandler" ],
            [ "orderItemConverter", "orderItemConverter" ],
            [ "orderManager", "orderManager" ],
            [ "itemManager", "itemManager" ]
        ]
    },

    // orderManager
    {
        prototype: OrderManager.prototype,
        name: "orderManager",
        dependencies: [
            [ "persistenceHandler", "persistenceHandler" ],
            [ "orderConverter", "orderConverter" ],
            [ "userManager", "userManager" ],
            [ "orderItemManager", "orderItemManager" ]
        ]
    },

    // userManager
    {
        prototype: UserManager.prototype,
        name: "userManager",
        dependencies: [
            [ "persistenceHandler", "persistenceHandler" ],
            [ "userConverter", "userConverter" ],
            [ "orderManager", "orderManager" ],
            [ "cartItemManager", "cartItemManager" ],
            [ "verificationCodeManager", "verificationCodeManager" ]
        ]
    },

    // verificationCodeManager
    {
        prototype: VerificationCodeManager.prototype,
        name: "verificationCodeManager",
        dependencies: [
            [ "persistenceHandler", "persistenceHandler" ],
            [ "verificationCodeConverter", "verificationCodeConverter" ],
            [ "userManager", "userManager" ]
        ]
    },

    // domainManager
    {
        prototype: DomainManagerImpl.prototype,
        name: "domainManager",
        dependencies: [
            [ "brandManager", "brandManager" ],
            [ "cartItemManager", "cartItemManager" ],
            [ "itemImageManager", "itemImageManager" ],
            [ "itemManager", "itemManager" ],
            [ "itemTypeManager", "itemTypeManager" ],
            [ "orderItemManager", "orderItemManager" ],
            [ "orderManager", "orderManager" ],
            [ "userManager", "userManager" ],
            [ "verificationCodeManager", "verificationCodeManager" ],
            [ "itemMetadataHandler", "itemMetadataHandler" ],
            [ "fileHandler", "fileHandler" ],
            [ "orderHandler", "orderHandler" ]
        ]
    },

    // brandConverter
    {
        prototype: BrandConverter.prototype,
        name: "brandConverter"
    },

    // cartItemConverter
    {
        prototype: CartItemConverter.prototype,
        name: "cartItemConverter"
    },

    // itemConverter
    {
        prototype: ItemConverter.prototype,
        name: "itemConverter"
    },

    // itemImageConverter
    {
        prototype: ItemImageConverter.prototype,
        name: "itemImageConverter"
    },

    // itemTypeConverter
    {
        prototype: ItemTypeConverter.prototype,
        name: "itemTypeConverter"
    },

    // orderConverter
    {
        prototype: OrderConverter.prototype,
        name: "orderConverter"
    },

    // orderItemConverter
    {
        prototype: OrderItemConverter.prototype,
        name: "orderItemConverter"
    },

    // userConverter
    {
        prototype: UserConverter.prototype,
        name: "userConverter"
    },

    // verificationCodeConverter
    {
        prototype: VerificationCodeConverter.prototype,
        name: "verificationCodeConverter"
    },

    // fileHandler
    {
        prototype: FileHandler.prototype,
        name: "fileHandler"
    },

    // orderHandler
    {
        prototype: OrderHandler.prototype,
        name: "orderHandler",
        dependencies: [
            [ 'domainManager', 'domainManager' ]
        ]
    },

    // BOUNDARY LAYER
    // imageRequestHandler
    {
        target: new ImageRequestHandler(),
        name: "imageRequestHandler"
    },

    // itemRestfulApi
    {
        provider: {
            func: function ([ domainManager ]: [ DomainManager ]): RequestHandler {
                return new ItemRestfulApi(domainManager);
            },
            params: [ 'domainManager' ]
        },
        name: "itemRestfulApi"
    },

    // itemTypeRestfulApi
    {
        provider: {
            func: function ([ domainManager ]: [ DomainManager ] ): RequestHandler {
                return new ItemTypeRestfulApi(domainManager);
            },
            params: [ 'domainManager' ]
        },
        name: 'itemTypeRestfulApi'
    },

    // brandRestfulApi
    {
        provider: {
            func: function ([ domainManager ]: [ DomainManager ]): RequestHandler {
                return new BrandRestfulApi(domainManager);
            },
            params: [ 'domainManager' ]
        },
        name: 'brandRestfulApi'
    },

    // orderRestfulApi
    {
        provider: {
            func: function ([ domainManager ]: [ DomainManager ]): RequestHandler {
                return new OrderRestfulApi(domainManager);
            },
            params: [ 'domainManager' ]
        },
        name: 'orderRestfulApi'
    },

    // userRestfulApi
    {
        provider: {
            func: function ([ domainManager ]: [ DomainManager ]): RequestHandler {
                return new UserRestfulApi(domainManager);
            },
            params: [ 'domainManager' ]
        },
        name: 'userRestfulApi'
    },

    // cartRestfulApi
    {
        provider: {
            func: function ([ domainManager ]: [ DomainManager ]): RequestHandler {
                return new CartRestfulApi(domainManager);
            },
            params: [ 'domainManager' ]
        },
        name: 'cartRestfulApi'
    }
];

export default objectsDeclaration;