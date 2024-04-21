import CartItemData from "../../persistence/data/CartItemData";
import PersistenceHandler from "../../persistence/PersistenceHandler";
import CartItemPrimaryKey from "../../persistence/pkeys/CartItemPrimaryKey";
import AsyncReversableConverter from "../../utils/interfaces/AsyncReversableConverter";
import CartItem from "../entities/upgrade/CartItem";
import Item from "../entities/upgrade/Item";
import User from "../entities/upgrade/User";
import EntityManager from "../EntityManager";
import PersistenceHandlerHolder from "../PersistenceHandlerHolder";

export default class CartItemManager extends PersistenceHandlerHolder implements
    EntityManager<CartItem, CartItemPrimaryKey> {

    //Fields
    private cartItemConverter?: AsyncReversableConverter<CartItemData, CartItem> | undefined;

    private userManager?: EntityManager<User, string> | undefined;
    private itemManager?: EntityManager<Item, string> | undefined;


    //Constructor
    public constructor(
        persistenceHandler?: PersistenceHandler | undefined,
        cartItemConverter?: AsyncReversableConverter<CartItemData, CartItem> | undefined,
        userManager?: EntityManager<User, string> | undefined,
        itemManager?: EntityManager<Item, string> | undefined,

    ) {
        super(persistenceHandler)
        this.cartItemConverter = cartItemConverter;
        this.userManager = userManager;
        this.itemManager = itemManager;
    }


    //Private Methods
    //useCartItemConverter
    private async useCartItemConverter<T>(
        executable: (cartItemConverter: AsyncReversableConverter<CartItemData, CartItem>) => Promise<T>
    ): Promise<T> {
        if (!this.cartItemConverter) {
            throw new Error("cartItemconverter field is missing!");
        }

        return executable(this.cartItemConverter);
    }

    //Entity User
    private async useUserManager<T>(
        executable: (userManager: EntityManager<User, string>) => Promise<T>
    ): Promise<T> {
        if (!this.userManager) {
            throw new Error("userManager field is missing!");
        }

        return executable(this.userManager);
    }


    //Entity Item 
    private async useItemManager<T>(
        executable: (itemManager: EntityManager<Item, string>) => Promise<T>
    ): Promise<T> {
        if (!this.itemManager) {
            throw new Error("itemManager field is missing!");
        }

        return executable(this.itemManager);
    }


    //PrecheckPath
    private precheckPath(pKey: CartItemPrimaryKey, path: any[]): CartItem | undefined {
        for (const obj of path) {
            if (obj instanceof CartItem) {
                if (obj.User?.Email === pKey.email && obj.Item?.Id === pKey.itemId && obj.Metadata === pKey.metadata) {
                    return obj;
                }
            }
        }
    }

    //Set Up Dependency 
    private async setupDependencies(entity: CartItem, path: any[]): Promise<void> {
        // Self definition
        const self = this;

        // User dependency
        entity.getUserCallback = async function () {
            return self.useUserManager(
                async userManager => userManager.get(entity.User?.Email as string, path)
            );
        }

        // Item dependency
        entity.getItemCallback = async function () {
            return self.useItemManager(
                async itemManager => itemManager.get(entity.Item?.Id as string, path)
            );
        }
    }


    // Methods

    //Get
    public async get(pKey: CartItemPrimaryKey, path: any[]): Promise<CartItem | undefined> {
        //precheck pạt
        let entity: CartItem | undefined = this.precheckPath(pKey, path);

        if (entity) {
            return entity;
        }

        // Lấy dữ liệu lên
        const data: CartItemData | undefined = await this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.getCartItem(pKey);
            }
        );

        // k tìm thấy trường hợp
        if (!data) {
            return;
        }

        // tìm thấy
        // biến đổi dữ liệu thành đối tượng?
        entity = await this.useCartItemConverter(
            async function (cartItemConverter) {
                return cartItemConverter.convert(data);
            }
        );

        // đẩy đối tượng vào path sau khi đã biến đổi
        path.push(entity);

        // Setup dependencies for entity
        await this.setupDependencies(entity, path);

        // trả đối tượng
        return entity;
    }


    //get ALl
    public async getAll(path: any[]): Promise<CartItem[]> {
        // Get all verification code data
        const dataList: CartItemData[] = await this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.getAllCartItems();
            }
        );

        // Result initialization
        const result: CartItem[] = [];

        // Converting data from data list to entities
        for (const data of dataList) {
            // Precheck path
            let entity: CartItem | undefined = this.precheckPath({ email: data.email, itemId: data.itemId, metadata: data.metadata }, path);

            if (entity) {
                result.push(entity);
                continue;
            }

            // Convert data to entity
            entity = await this.useCartItemConverter(
                async function (cartItemConverter) {
                    return cartItemConverter.convert(data);
                }
            );

            // Push entity into path
            path.push(entity);

            // Setup entity's dependencies
            await this.setupDependencies(entity, path);

            // Push entity into result
            result.push(entity);
        }

        // Return result
        return result;
    }


    //get by filter
    public async getByFilter(filter: any, path: any[]): Promise<CartItem[]> {
        // Get all data from db
        const dataList: CartItemData[] = await this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.getCartItemsByFilter(filter);
            }
        );

        // Result initialization
        const result: CartItem[] = [];

        // Converting data into entities
        for (const data of dataList) {
            // Precheck path
            let entity: CartItem | undefined = this.precheckPath({ email: data.email, itemId: data.itemId, metadata: data.metadata }, path);

            if (entity) {
                result.push(entity);
                continue;
            }

            // Convert data into entity
            entity = await this.useCartItemConverter(
                async function (cartItemConverter) {
                    return cartItemConverter.convert(data);
                }
            );

            // Push entity into path
            path.push(entity);

            // Setup dependencies for entity
            await this.setupDependencies(entity, path);

            // Push entity into result
            result.push(entity);
        }

        // Return result
        return result;
    }


    //Insert
    public async insert(target: CartItem): Promise<void> {
        const self = this;

        return this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.insertCartItem(

                    await self.useCartItemConverter(
                        async function (cartItemConverter) {
                            return cartItemConverter.reverse(target);
                        }
                    )

                );
            }
        )
    }

    //Update
    public async update(target: CartItem): Promise<void> {
        const self = this;

        return this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.updateCartItem(

                    await self.useCartItemConverter(
                        async function (cartItemConverter) {
                            return cartItemConverter.reverse(target);
                        }
                    )

                );
            }
        )
    }

    //Remove
    public async remove(target: CartItem): Promise<void> {
        const self = this;

        return this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.removeCartItem(

                    await self.useCartItemConverter(
                        async function (cartItemConverter) {
                            return cartItemConverter.reverse(target);
                        }
                    )

                );
            }
        )
    }

    //removeByFilter
    public async removeByPrimaryKey(pKey: CartItemPrimaryKey): Promise<void> {
        return this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.removeCartItemByPrimaryKey(pKey);
            }
        );
    }


    //Getter và Setter 
    public get CartItemConverter(): AsyncReversableConverter<CartItemData, CartItem> | undefined {
        return this.cartItemConverter;
    }

    public set CartItemConverter(value: AsyncReversableConverter<CartItemData, CartItem> | undefined) {
        this.cartItemConverter = value;
    }

    public get UserManager(): EntityManager<User, string> | undefined {
        return this.userManager;
    }

    public set UserManager(value: EntityManager<User, string> | undefined) {
        this.userManager = value;
    }

    public get ItemManager(): EntityManager<Item, string> | undefined {
        return this.itemManager;
    }

    public set ItemManager(value: EntityManager<Item, string> | undefined) {
        this.itemManager = value;
    }

}



