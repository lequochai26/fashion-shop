import ItemImageData from "../../persistence/data/ItemImageData";
import PersistenceHandler from "../../persistence/PersistenceHandler";
import ItemImagePrimaryKey from "../../persistence/pkeys/ItemImagePrimaryKey";
import AsyncReversableConverter from "../../utils/interfaces/AsyncReversableConverter";
import Item from "../entities/upgrade/Item";
import ItemImage from "../entities/upgrade/ItemImage";
import EntityManager from "../EntityManager";
import PersistenceHandlerHolder from "../PersistenceHandlerHolder";

export default class ItemImageManager extends PersistenceHandlerHolder implements EntityManager<ItemImage, ItemImagePrimaryKey> {

    //Fields
    private itemImageConverter?: AsyncReversableConverter<ItemImageData, ItemImage> | undefined;

    private itemManager?: EntityManager<Item, string> | undefined;
    //Constructor

    public constructor(
        persistenceHandler?: PersistenceHandler | undefined,
        itemImageConverter?: AsyncReversableConverter<ItemImageData, ItemImage> | undefined,
        itemManager?: EntityManager<Item, string> | undefined,

    ) {
        super(persistenceHandler)
        this.itemImageConverter = itemImageConverter;
        this.itemManager = itemManager;
    }

    //Private Methods
    //useCartItemConverter
    private async useItemImageConverter<T>(
        executable: (cartItemConverter: AsyncReversableConverter<ItemImageData, ItemImage>) => Promise<T>
    ): Promise<T> {
        if (!this.itemImageConverter) {
            throw new Error("cartItemconverter field is missing!");
        }

        return executable(this.itemImageConverter);
    }

    private async useItemManager<T>(
        executable: (itemManager: EntityManager<Item, string>) => Promise<T>
    ): Promise<T> {
        if (!this.itemManager) {
            throw new Error("itemManager field is missing!");
        }

        return executable(this.itemManager);
    }

    //PrecheckPath
    private precheckPath(pKey: ItemImagePrimaryKey, path: any[]): ItemImage | undefined {
        for (const obj of path) {
            if (obj instanceof ItemImage) {
                if (obj.Item?.Id === pKey.itemId && obj.Path === pKey.path) {
                    return obj;
                }
            }
        }
    }

    //Set Up Dependency 
    private async setupDependencies(entity: ItemImage, path: any[]): Promise<void> {
        // Self definition
        const self = this;

        // Item dependency
        entity.getItemCallback = async function () {
            return self.useItemManager(
                async itemManager => itemManager.get(entity.Item?.Id as string, path)
            );
        }
    }


    //Methods
    public async get(pKey: ItemImagePrimaryKey, path: any[]): Promise<ItemImage | undefined> {
        //precheckPath
        let entity: ItemImage | undefined = this.precheckPath(pKey, path);

        if (entity) {
            return entity;
        }

        // Lấy dữ liệu lên
        const data: ItemImageData | undefined = await this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.getItemImage(pKey);
            }
        );

        // k tìm thấy trường hợp
        if (!data) {
            return;
        }

        // tìm thấy
        // biến đổi dữ liệu thành đối tượng?
        entity = await this.useItemImageConverter(
            async function (itemImageConverter) {
                return itemImageConverter.convert(data);
            }
        );

        // đẩy đối tượng vào path sau khi đã biến đổi
        path.push(entity);

        // Setup dependencies for entity
        await this.setupDependencies(entity, path);

        // trả đối tượng
        return entity;
    }

    public async getAll(path: any[]): Promise<ItemImage[]> {
        // Get all verification code data
        const dataList: ItemImageData[] = await this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.getAllItemImages();
            }
        );

        // Result initialization
        const result: ItemImage[] = [];

        // Converting data from data list to entities
        for (const data of dataList) {
            // Precheck path
            let entity: ItemImage | undefined = this.precheckPath({ itemId: data.itemId, path: data.path }, path);

            if (entity) {
                result.push(entity);
                continue;
            }

            // Convert data to entity
            entity = await this.useItemImageConverter(
                async function (itemImageConverter) {
                    return itemImageConverter.convert(data);
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


    public async getByFilter(filter: any, path: any[]): Promise<ItemImage[]> {
        // lấy tất cả từ mgdb
        const dataList: ItemImageData[] = await this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.getItemImagesByFilter(filter);
            }
        );

        // Khởi tạo kết quả
        const result: ItemImage[] = [];

        // đổi dữ liệu qua đối tượng
        for (const data of dataList) {
            // Precheck path
            let entity: ItemImage | undefined = this.precheckPath({ itemId: data.itemId, path: data.path }, path);

            if (entity) {
                result.push(entity);
                continue;
            }

            // đổi dữ liệu qua đối tượng
            entity = await this.useItemImageConverter(
                async function (itemImageConverter) {
                    return itemImageConverter.convert(data);
                }
            );

            // đẩy đối tượng vô path
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
    public async insert(target: ItemImage): Promise<void> {
        const self = this;

        return this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.insertItemImage(

                    await self.useItemImageConverter(
                        async function (itemImageConverter) {
                            return itemImageConverter.reverse(target);
                        }
                    )

                );
            }
        )
    }


    //Update
    public async update(target: ItemImage): Promise<void> {
         const self = this;

        return this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.updateItemImage(

                    await self.useItemImageConverter(
                        async function (itemImageConverter) {
                            return itemImageConverter.reverse(target);
                        }
                    )

                );
            }
        )
    }
    
    //Remove
    public async remove(target: ItemImage): Promise<void> {
        const self = this;

        return this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.removeItemImage(

                    await self.useItemImageConverter(
                        async function (itemImageConverter) {
                            return itemImageConverter.reverse(target);
                        }
                    )

                );
            }
        )
    }

    removeByPrimaryKey(pKey: ItemImagePrimaryKey): Promise<void> {
        return this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.removeItemImageByPrimaryKey(pKey);
            }
        );
    }

    //Getter và Setter 
    public get ItemImageConverter(): AsyncReversableConverter<ItemImageData, ItemImage> | undefined {
        return this.itemImageConverter;
    }

    public set ItemImageConverter(value: AsyncReversableConverter<ItemImageData, ItemImage> | undefined) {
        this.itemImageConverter = value;
    }

    public get ItemManager(): EntityManager<Item, string> | undefined {
        return this.itemManager;
    }

    public set ItemManager(value: EntityManager<Item, string> | undefined) {
        this.itemManager = value;
    }

}
