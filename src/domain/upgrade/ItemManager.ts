import ItemData from "../../persistence/data/ItemData";
import PersistenceHandler from "../../persistence/PersistenceHandler";
import CartItemPrimaryKey from "../../persistence/pkeys/CartItemPrimaryKey";
import ItemImagePrimaryKey from "../../persistence/pkeys/ItemImagePrimaryKey";
import OrderItemPrimaryKey from "../../persistence/pkeys/OrderItemPrimaryKey";
import AsyncReversableConverter from "../../utils/interfaces/AsyncReversableConverter";
import Brand from "../entities/upgrade/Brand";
import CartItem from "../entities/upgrade/CartItem";
import Item from "../entities/upgrade/Item";
import ItemImage from "../entities/upgrade/ItemImage";
import ItemType from "../entities/upgrade/ItemType";
import Order from "../entities/upgrade/Order";
import OrderItem from "../entities/upgrade/OrderItem";
import EntityManager from "../EntityManager";
import PersistenceHandlerHolder from "../PersistenceHandlerHolder";
import SearchableEntityManager from "../SearchableEntityManager";

export default class ItemManager extends PersistenceHandlerHolder implements SearchableEntityManager<Item,string>{
    //FIELD
    private itemConverter?: AsyncReversableConverter<ItemData, Item>;
    private itemTypeManager?: EntityManager<ItemType, string> | undefined;
    private brandManager?: EntityManager<Brand, string> | undefined;
    private itemImageManager?: EntityManager<ItemImage, ItemImagePrimaryKey> | undefined;
    private orderItemManager?: EntityManager<OrderItem, OrderItemPrimaryKey> | undefined;
    private cartItemManager?: EntityManager<CartItem, CartItemPrimaryKey> | undefined;


    //CONSTRUCTOR
    public constructor(
        persistenceHandler?: PersistenceHandler,
        itemConverter?: AsyncReversableConverter<ItemData,Item> | undefined,
        itemTypeManager?:EntityManager<ItemType, string> | undefined,
        brandManager?:EntityManager<Brand, string> | undefined,
        itemImageManager?:EntityManager<ItemImage, ItemImagePrimaryKey> | undefined,
        orderItemManager?:EntityManager<OrderItem, OrderItemPrimaryKey> | undefined,
        cartItemManager?: EntityManager<CartItem, CartItemPrimaryKey> | undefined
    ){
        super(persistenceHandler);

        this.itemConverter = itemConverter;
        this.itemTypeManager = itemTypeManager;
        this.brandManager = brandManager;
        this.itemImageManager = itemImageManager;
        this.orderItemManager = orderItemManager;
        this.cartItemManager = cartItemManager;
    }

    //PRIVATE METHODS
    private  useItemConverter<T>(
        executable: (itemConverter: AsyncReversableConverter<ItemData,Item>) => Promise<T>
    ): Promise<T> {
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
            throw new Error("useItemImageManager field is missing!");
        }
        return executable(this.itemImageManager)
    }

    //useOrderManager
    private async useOrderItemManager<T>(
        executable:(orderItemManager:EntityManager<OrderItem, OrderItemPrimaryKey>) => Promise<T>
    ):Promise<T>{
        if(!this.orderItemManager){
            throw new Error("useOrderManager field is missing!");
        }
        return executable(this.orderItemManager);
    }

    //useCartItemManager
    private async useCartItemManager<T>(
        executable:(cartItemManager:EntityManager<CartItem, CartItemPrimaryKey>) => Promise<T>
    ):Promise<T> {
        if(!this.cartItemManager) {
            throw new Error("useCartItemManager field is missing!");
        }
        return executable(this.cartItemManager);
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
        // Self definition
        const self = this;

        //ItemType dependency
        if (entity.Type) {
            entity.getTypeCallback = async function () {
                return self.useItemTypeManager(
                    async itemTypeManager => itemTypeManager.get(entity.Type?.Id as string, path)
                );
            }
        }

        //Brand dependency
        if (entity.Brand) {
            entity.getBrandCallback = async function () {
                return self.useBrandManager(
                    async brandManager => brandManager.get(entity.Brand?.Id as string, path)
                );
            }
        }

        //ItemImage dependency
        entity.getImagesCallback = async function () {
            return self.useItemImageManager(
                async itemImageManager => itemImageManager.getByFilter({ itemId: entity.Id }, path)
            );
        }

        //Order dependency
        entity.getOrdersCallback = async function () {
            return self.useOrderItemManager(
                async orderItemManager => orderItemManager.getByFilter({ itemId: entity.Id }, path)
            );
        }

        //User cartItem dependency
        entity.getUsersCallback = async function () {
            return self.useCartItemManager(
                async cartItemManager => cartItemManager.getByFilter({ itemId: entity.Id }, path)
            );
        }
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
        entity = await this.useItemConverter(
            async function(itemConverter){
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

            entity = await this.useItemConverter(
                async function(ItemManager){
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
            entity = await this.useItemConverter(
                async function(itemConverter){
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
                    await self.useItemConverter(
                        async function(itemConverter){
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
                    await self.useItemConverter(
                        async function(itemConverter){
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
                    await self.useItemConverter(
                        async function(itemConverter){
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

    public async getByFilterFunc(filterFunc: (value: Item) => boolean | Promise<boolean>): Promise<Item[]> {
        const items = await this.getAll([]);
        const result: Item[] = [];
        for (const item of items) {
            if (await filterFunc(item)) {
                result.push(item);
            }
        }
        return result;
    }

    public async search(keyword: string): Promise<Item[]> {
        return this.getByFilterFunc(
            async function (item: Item) {
                return (
                    `${item.Id}  ${item.Name} ${item.Description} ${item.Price} ${item.BuyPrice} ${(await item.getType())?.Id} ${(await item.getType())?.Name} ${(item.Gender as boolean ? "Nam" : "Nữ")} ${(await item.getBrand())?.Id} ${(await item.getBrand())?.Name}`
                    .toLowerCase()
                    .indexOf(
                        keyword.toLowerCase()
                    ) !== -1
                );
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

    public get CartItemManager(): EntityManager<CartItem, CartItemPrimaryKey> | undefined {
        return this.cartItemManager;
    }
    public set CartItemManager(value: EntityManager<CartItem, CartItemPrimaryKey> | undefined) {
        this.cartItemManager = value;
    }
}
    
