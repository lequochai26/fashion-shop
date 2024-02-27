import PersistenceHandler from "../persistence/PersistenceHandler";
import ItemTypeData from "../persistence/data/ItemTypeData";
import ReversableConverter from "../utils/interfaces/ReversableConverter";
import EntityManager from "./EntityManager";
import PersistenceHandlerHolder from "./PersistenceHandlerHolder";
import Item from "./entities/Item";
import ItemType from "./entities/ItemType";

export default class ItemTypeManager extends PersistenceHandlerHolder implements EntityManager<ItemType,string>{
    //field
    private itemTypeConverter?: ReversableConverter<ItemTypeData, ItemType> | undefined;
    private itemManager?: EntityManager<Item, string> | undefined;
    
    //constructor
    public constructor(
        persistenceHandler?: PersistenceHandler | undefined,
        itemTypeConverter?: ReversableConverter<ItemTypeData,ItemType> | undefined,
        itemManager?: EntityManager<Item,string> | undefined
    ){
        super(persistenceHandler);

        this.itemTypeConverter = itemTypeConverter;
        this.itemManager = itemManager;
    }

    
    //check xem cac converter co ton tai hay ko
    //private method
     private useItemtypeConverter<T>(
        executable:(itemTypeConverter: ReversableConverter<ItemTypeData,ItemType>) => T
    ): T {
        if(!this.itemTypeConverter){
            throw new Error("itemTypeConverter field is missing") //ko co thi bao loi
        }

        return executable(this.itemTypeConverter); // goi excutable truyền vô
    }

    private async useItemManager<T>(
        executable: (itemManager: EntityManager<Item, string>) => Promise<T>
    ): Promise<T> {
        if (!this.itemManager) {
            throw new Error("itemManager field is missing!");
        }

        return executable(this.itemManager);
    }

    //check path
    private precheckPath(pKey: string,path: any[]) : ItemType | undefined{
        //kt trong path
        for(const obj of path){
            //neu obj la doi tuong thuoc kieu Brand
            if(obj instanceof ItemType){
                if(obj.Id === pKey){
                    return obj; // thoa đk thi tra obj ko thi la undefined
                }
            }
        }
    }
    //setup denpendencies
    private async setupDependencies(entity: ItemType, path: any[]): Promise<void>{
        //item
        entity.Items = await this.useItemManager(
            async function(itemManager){
                return itemManager.getByFilter(
                    { itemType: entity.Id }, path);
            }
        )
    }
    public async get(pKey: string, path: any[]): Promise<ItemType | undefined> {
        //check entity da co trong path chua
        let enity : ItemType | undefined = this.precheckPath(pKey,path);
        //
        //convert r thi ko convert lai nua, lay tu trong path ra luon
       if(enity){
        return enity;
       }
       //lay data voi pKey da co 
       const data: ItemTypeData | undefined = await this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.getBrand(pKey);
            }
       );
       //ko co thi tra ve
       if(!data){
        return;
       }

       //co data thi chuyen data thanh entity
       enity = this.useItemtypeConverter(
         function (itemTypeConverter){
            return itemTypeConverter.convert(data);
         }
       );
       
       //day entity vao path sau khi converter
       path.push(enity);

       //thiet lap cac denpendencies
       this.setupDependencies(enity,path);

       //return
       return enity;

    }
    public async getAll(path: any[]): Promise<ItemType[]> {
         //nhan tat ca data
         const dataBrandList : ItemTypeData[] = await this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.getAllBrands();
            }
        );
        //khoi tao 1 mang rong
        const result : ItemType[] = [];

        //cd data tu data list sang entities
        for(const data of dataBrandList){
            //check path
            let enity : ItemType | undefined = this.precheckPath(data.id,path);

            if(enity){
                result.push(enity);
                continue;
            }

            //cđ data sang entity
            enity = this.useItemtypeConverter(
                function(itemTypeConverter){
                    return itemTypeConverter.convert(data);
                }
            )
            // day entity len path
            path.push(enity);

            // day entity vao result
            result.push(enity);

        }
        //return result
        return result;
    }
    public async getByFilter(filter: any, path: any[]): Promise<ItemType[]> {
         //nhan tat ca data
         const dataBrandList : ItemTypeData[] = await this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.getAllBrands();
            }
        );
        //khoi tao 1 mang rong
        const result : ItemType[] = [];

        //cd data tu data list sang entities
        for(const data of dataBrandList){
            //check path
            let enity : ItemType | undefined = this.precheckPath(data.id,path);

            if(enity){
                result.push(enity);
                continue;
            }

            //cđ data sang entity
            enity = this.useItemtypeConverter(
                function(itemTypeConverter){
                    return itemTypeConverter.convert(data);
                }
            )
            // day entity len path
            path.push(enity);

             //xet phu thuoc
            this.setupDependencies(enity,path);

            // day entity vao result
            result.push(enity);

        }
        //return result
        return result;
    }
    public async insert(target: ItemType): Promise<void> {
        const self = this;

        return this.usePersistenceHandler(
           async function (persistenceHandler) {
                return persistenceHandler.insertItemType(
                    self.useItemtypeConverter(
                        function(itemTypeConverter){
                            return itemTypeConverter.reverse(target);
                        }
                    )
                );
           }
        );
    }
    public async update(target: ItemType): Promise<void> {
       const self = this;
       return this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.updateItemType(
                    self.useItemtypeConverter(
                        function(itemTypeConverter){
                            return itemTypeConverter.reverse(target);
                        }
                    )
                );
            }
       )
    }
    public async remove(target: ItemType): Promise<void> {
        const self = this;
        return this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.removeItemType(
                    self.useItemtypeConverter(
                        function(itemTypeConverter){
                            return itemTypeConverter.reverse(target);
                        }
                    )
                );
            }
        )
    }
    public async removeByPrimaryKey(pKey: string): Promise<void> {
       return this.usePersistenceHandler(
         async function (persistenceHandler) {
            return persistenceHandler.removeItemTypeByPrimaryKey(pKey);
         }
       )
    }
    
   //get va set
    public get ItemTypeConverter(): ReversableConverter<ItemTypeData, ItemType> | undefined {
        return this.itemTypeConverter;
    }
    public set ItemTypeConverter(value: ReversableConverter<ItemTypeData, ItemType> | undefined) {
        this.itemTypeConverter = value;
    }
    public get ItemManager(): EntityManager<Item, string> | undefined {
        return this.itemManager;
    }
    public set ItemManager(value: EntityManager<Item, string> | undefined) {
        this.itemManager = value;
    }

}