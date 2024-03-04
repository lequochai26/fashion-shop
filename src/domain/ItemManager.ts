import PersistenceHandler from "../persistence/PersistenceHandler";
import ItemData from "../persistence/data/ItemData";
import ItemImagePrimaryKey from "../persistence/pkeys/ItemImagePrimaryKey";
import OrderItemPrimaryKey from "../persistence/pkeys/OrderItemPrimaryKey";
import ReversableConverter from "../utils/interfaces/ReversableConverter";
import EntityManager from "./EntityManager";
import PersistenceHandlerHolder from "./PersistenceHandlerHolder";
import SearchableEntityManager from "./SearchableEntityManager";
import Brand from "./entities/Brand";
import Item from "./entities/Item";
import ItemImage from "./entities/ItemImage";
import ItemType from "./entities/ItemType";
import Order from "./entities/Order";
import OrderItem from "./entities/OrderItem";

export default class ItemManager extends PersistenceHandlerHolder implements SearchableEntityManager<Item,string>{
    //FIELD
    private itemConverter?: ReversableConverter<ItemData, Item>;
    private itemTypeManager?: EntityManager<ItemType, string> | undefined;
    private brandManager?: EntityManager<Brand, string> | undefined;
    private itemImageManager?: EntityManager<ItemImage, ItemImagePrimaryKey> | undefined;
    private orderItemManager?: EntityManager<OrderItem, OrderItemPrimaryKey> | undefined;
    //CONSTRUCTOR
    public constructor(
        persistenceHandler?: PersistenceHandler,
        itemConverter?: ReversableConverter<ItemData,Item> | undefined,
        itemTypeManager?:EntityManager<ItemType, string> | undefined,
        brandManager?:EntityManager<Brand, string> | undefined,
        itemImageManager?:EntityManager<ItemImage, ItemImagePrimaryKey> | undefined,
        orderItemManager?:EntityManager<OrderItem, OrderItemPrimaryKey> | undefined
    ){
        super(persistenceHandler);

        this.itemConverter = itemConverter;
        this.itemTypeManager = itemTypeManager;
        this.brandManager = brandManager;
        this.itemImageManager = itemImageManager;
        this.orderItemManager = orderItemManager;
    }

    //PRIVATE METHODS
    private  useItemConverter<T>(
        executable: (itemConverter: ReversableConverter<ItemData,Item>) => T
    ): T {
        if(!this.itemConverter){
            throw new Error("itemConverter field is missing!")
        }
        return executable(this.itemConverter);
    }

    //useItemTypeManager
    private async useItemTypeManager<T>(
        executable:(itemTypeManager: EntityManager<ItemType, string>) => Promise<T>
    ): Promise<T>{
        if(!this.itemTypeManager){
            throw new Error("useItemTypeManager field is missing!");
        }
        return executable(this.itemTypeManager);
    }
        
    //useBrandManager
    private async useBrandManager<T>(
        executable:(brandManager:EntityManager<Brand, string>) => Promise<T>
    ): Promise<T>{
        if(!this.brandManager){
            throw new Error("useBrandManager field is missing!");   
        }
        return executable(this.brandManager);
    }
    
    //useItemImageManager
    private async useItemImageManager<T>(
        executable:(itemImageManager:EntityManager<ItemImage, ItemImagePrimaryKey>) => Promise<T>
    ):Promise<T>{
        if(!this.itemImageManager){
            throw new Error("useItemImageManager field is missing!")
        }
        return executable(this.itemImageManager)
    }

    //useOrderManager
    private async useOrderItemManager<T>(
        executable:(orderItemManager:EntityManager<OrderItem, OrderItemPrimaryKey>) => Promise<T>
    ):Promise<T>{
        if(!this.orderItemManager){
            throw new Error("useOrderManager feild is missing!")
        }
        return executable(this.orderItemManager);
    }

    //preCheckPath
    private preCheckPath(pKey:string,path:any[]):Item | undefined{
        for(const obj of path){
            if (obj instanceof Item){
                if(obj.Id === pKey){
                    return obj
                }
            }
        }
    }

    //setupDependencies
    private async setupDependencies(entity:Item,path:any[]):Promise<void>{
        //ItemType dependency
        if (entity.Type) {
            entity.Type = await this.useItemTypeManager(
                async function (itemTypeManager) {
                    return itemTypeManager.get(entity.Type?.Id as string, path);
                }
            )
        }

        //Brand dependency
        if (entity.Brand) {
            entity.Brand = await this.useBrandManager(
                async function (brandManager) {
                    return brandManager.get(entity.Brand?.Id as string, path); 
                }
            )
        }

        //ItemImage dependency
        entity.Images = await this.useItemImageManager(
            async function (itemImageManager) {
                return itemImageManager.getByFilter({itemId:entity.Id as string}, path);
            }
        )

        //Order dependency
        entity.Orders = await this.useOrderItemManager(
            async function (orderItemManager) {
                return orderItemManager.getByFilter({itemId:entity.Id as string}, path);
            }
        )
    }



    public async get(pKey: string, path: any[]): Promise<Item | undefined> {
        //khoi tao entity
        let entity:Item | undefined = this.preCheckPath(pKey,path);

        if(entity){
            return entity;
        }

        //khoi tao bien lay du lieu
        const data: ItemData | undefined = await this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.getItem(pKey);
            }
        );

        //khong co du lieu
        if(!data){
            return;
        }

        //tim thay du lieu
        //chuyen hoa du lieu thanh entity
        entity = this.useItemConverter(
            function(itemConverter){
                return itemConverter.convert(data);
            }
        )

        //day entity len path
        path.push(entity);
        //cai dat dependency cho entity
        await this.setupDependencies(entity,path);
        //tra ve entity

        return entity;
    }
    
    public async getAll(path: any[]): Promise<Item[]> {
        let datalist:ItemData[]|undefined = await this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.getAllItems()  
            }
        )

        const result: Item []=[];

        for(const data of datalist){
            let entity:Item | undefined = this.preCheckPath(data.id,path)

            if(entity){
                result.push(entity);
                continue;
            }

            entity = this.useItemConverter(
                function(ItemManager){
                    return ItemManager.convert(data);
                }
            )

            //day entity len path
            path.push(entity);
            //cai dat entity cua dependency
            await this.setupDependencies(entity,path);
            //day entity vao result
            result.push(entity);
        }
        return result;
    }
    
    public async getByFilter(filter: any, path: any[]): Promise<Item[]> {
        let datalist: ItemData []| undefined= await this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.getItemsByFilter(filter);
            }
        )
        
        //khoi tao bien result
        const result: Item [] = [];

        //chuyen hoa data vao trong entity
        for(const data of datalist){
            //precheck path
            let entity : Item | undefined = this.preCheckPath(data.id,path);

            if(entity){
                result.push(entity);
                continue;
            }
            //chuyen hoa vao trong path
            entity = this.useItemConverter(
                function(itemConverter){
                    return itemConverter.convert(data);
                }
            )

            //day entity len path
            path.push(entity);
            //cai dat dependency
            await this.setupDependencies(entity,path);
            //day entity vao result
            result.push(entity)
        }
        return result
    }
    
    public async insert(target: Item): Promise<void> { 
        const self=this;

        return this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.insertItem(
                    self.useItemConverter(
                        function(itemConverter){
                            return itemConverter.reverse(target);
                        }
                    )
                )
            }
        )
    }
    
    public async update(target: Item): Promise<void> {
        const self = this

        return this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.updateItem(
                    self.useItemConverter(
                        function(itemConverter){
                            return itemConverter.reverse(target)
                        }
                    )
                )
            }
        ) 
    }
    
    public async remove(target: Item): Promise<void> {
        const self = this

        return this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.removeItem(
                    self.useItemConverter(
                        function(itemConverter){
                            return itemConverter.reverse(target)
                        }
                    )
                )
            }
        )
    }
    
    public async removeByPrimaryKey(pKey: string): Promise<void> {
        return this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.removeItemByPrimaryKey(pKey);
            }
        )
    }

    public async getByFilterFunc(filterFunc: (value: Item) => boolean): Promise<Item[]> {
        return (await this.getAll([])).filter(
            filterFunc
        )
    }

    public async search(keyword: string): Promise<Item[]> {
        return this.getByFilterFunc(
            function (item: Item) {
                return (`${item.Id}  ${item.Name} ${item.Price} ${item.Type}`.indexOf(keyword) !== -1);
            }
        )
    }

    //GETTER and SETTER
    public get ItemTypeManager():EntityManager<ItemType, string> | undefined{
        return this.ItemTypeManager;
    }
    public set ItemTypeManager(value:EntityManager<ItemType,string> | undefined){
        this.ItemTypeManager=value;
    }

    
    public get BrandManager(): EntityManager<Brand, string> | undefined{
        return this.BrandManager;
    }
    public set BrandManager(value:EntityManager<Brand,string> | undefined){
        this.BrandManager=value;
    }


    public get ItemImageManager(): EntityManager<ItemImage, ItemImagePrimaryKey> | undefined{
        return this.ItemImageManager;
    }
    public set ItemImageManager(value:EntityManager<ItemImage,string> | undefined){
        this.ItemImageManager=value;
    }


    public get OrderManager():EntityManager<Order, string> | undefined{
        return this.OrderManager;
    }
    public set OrderManager(value:EntityManager<Order, string> | undefined){
        this.OrderManager = value;
    }

}
    
