import BrandData from "../../persistence/data/BrandData";
import PersistenceHandler from "../../persistence/PersistenceHandler";
import AsyncReversableConverter from "../../utils/interfaces/AsyncReversableConverter";
import Brand from "../entities/upgrade/Brand";
import Item from "../entities/upgrade/Item";
import EntityManager from "../EntityManager";
import PersistenceHandlerHolder from "../PersistenceHandlerHolder";
import SearchableEntityManager from "../SearchableEntityManager";

export default class BrandManager extends PersistenceHandlerHolder implements SearchableEntityManager<Brand,string>{
    
    //field
    private brandConverter?: AsyncReversableConverter<BrandData, Brand> | undefined;
    private itemManager?: EntityManager<Item, string> | undefined;

    
    //constructor
    public constructor(
        persistenceHandler?: PersistenceHandler | undefined,
        brandConverter?: AsyncReversableConverter<BrandData,Brand> | undefined,
        itemManager?: EntityManager<Item,string>| undefined)
    {
        super(persistenceHandler);

        this.brandConverter = brandConverter;
        this.itemManager = itemManager;
    }
    
    // private method   
    
     //check xem cac converter co ton tai hay ko
    private async useBrandConverter<T>(
        executable:(brandConverter: AsyncReversableConverter<BrandData,Brand>) => Promise<T>
        ): Promise<T> {
        if(!this.brandConverter){
            throw new Error("brandConverter field is missing") //ko co thi bao loi
        }

        return executable(this.brandConverter); // goi excutable truyền vô
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
    private precheckPath(pKey: string,path: any[]) : Brand | undefined{
        //kt trong path
        for(const obj of path){
            //neu obj la doi tuong thuoc kieu Brand
            if(obj instanceof Brand){
                if(obj.Id === pKey){
                    return obj; // thoa đk thi tra obj ko thi la undefined
                }
            }
        }
    }
    //setup denpendencies
    private async setupDependencies(entity: Brand, path: any[]): Promise<void>{
        // Self definition
        const self = this;

        //item
        entity.getItemsCallback = async function () {
            return self.useItemManager(
                async itemManager => itemManager.getByFilter({ brand: entity.Id }, path)
            );
        }
    }

    

    //method
    
    public async get(pKey: string, path: any[]): Promise<Brand | undefined> {
        //check entity da co trong path chua
        let entity : Brand | undefined = this.precheckPath(pKey,path);
        //
        //convert r thi ko convert lai nua, lay tu trong path ra luon
        if (entity) {
            return entity;
        }
       //lay data voi pKey da co 
       const data: BrandData | undefined = await this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.getBrand(pKey);
            }
       );
       //ko co thi tra ve
       if(!data){
        return;
       }

       //co data thi chuyen data thanh entity
        entity = await this.useBrandConverter(
            async function (brandConverter){
                return brandConverter.convert(data);
            }
        );
         
         //day entity vao path sau khi converter
         path.push(entity);
         
         //thiet lap cac denpendencies
       await this.setupDependencies(entity,path);
       
       //return
       return entity;

    }
    public async getAll(path: any[]): Promise<Brand[]> {
        //nhan tat ca data
        const dataBrandList : BrandData[] = await this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.getAllBrands();
            }
        );
        //khoi tao 1 mang rong
        const result : Brand[] = [];

        //cd data tu data list sang entities
        for(const data of dataBrandList){
            //check path
            let entity : Brand | undefined = this.precheckPath(data.id,path);

            if(entity){
                result.push(entity);
                continue;
            }
            
            //cđ data sang entity
            entity = await this.useBrandConverter(
                async function (brandConverter){
                    return brandConverter.convert(data);
                }
            )
            // day entity len path
            path.push(entity);
            
            //set up
            await this.setupDependencies(entity,path);

            // day entity vao result
            result.push(entity);

        }
        //return result
        return result;
    }
    public async getByFilter(filter: any, path: any[]): Promise<Brand[]> {
        //nhan tat ca data
        const dataBrandList : BrandData[] = await this.usePersistenceHandler(
            async function (persistenceHandler) {
                    return persistenceHandler.getAllBrands();
                }
            );
            //khoi tao 1 mang rong
            const result : Brand[] = [];
    
            //cd data tu data list sang entities
            for(const data of dataBrandList){
                //check path
                let entity : Brand | undefined = this.precheckPath(data.id,path);
                
                if(entity){
                    result.push(entity);
                    continue;
                }
                
                //cđ data sang entity
                entity = await this.useBrandConverter(
                    async function(brandConverter){
                        return brandConverter.convert(data);
                    }
                    )
                // day entity len path
                path.push(entity);
                
                //xet phu thuoc
                await this.setupDependencies(entity,path);
                
                // day entity vao result
                result.push(entity);
                
            }
            //return result
            return result;
    }
    public async insert(target: Brand): Promise<void> {
        const self = this;

        return this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.insertBrand(
                    await self.useBrandConverter(
                        async function (brandConverter){
                            return brandConverter.reverse(target);
                        }
                    )
                );
            }
       )
    }
    public async update(target: Brand): Promise<void> {
        const self = this;

        return this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.updateBrand(
                    await self.useBrandConverter(
                        
                        async function(brandConverter){
                            return brandConverter.reverse(target);
                        }
                        )
                );
                
            }
        )
    }
    public async remove(target: Brand): Promise<void> {
       const self = this;
       
       return this.usePersistenceHandler(
         async function (persistenceHandler) {
            return persistenceHandler.removeBrand(
                await self.useBrandConverter(
                    async function(brandConverter){
                        return brandConverter.reverse(target);
                    }
                    )
                    );
                }
       )
    }
    public async removeByPrimaryKey(pKey: string): Promise<void> {
       return this.usePersistenceHandler(
           async function (persistenceHandler) {
            return persistenceHandler.removeBrandByPrimaryKey(pKey);
        }
        );
    }
    
    //nhận một keyword và trả về 
    //một Promise chứa một mảng các obj Brand.
    public async getByFilterFunc(filterFunc: (value: Brand) => boolean | Promise<boolean>): Promise<Brand[]> {
        const brands = await this.getAll([]);
        const result: Brand[] = [];
        for (const brand of brands) {
            if (await filterFunc(brand)) {
                result.push(brand);
            }
        }
        return result;
    }
    //search dua vao getbyfilter de tim kiem 
    public async search(keyword: string): Promise<Brand[]> {
        return this.getByFilterFunc( //goi ham getbyfilterfun kt co ko
            function(brand:Brand){
                //khac -1 la co
                return(`${brand.Id} ${brand.Name}`.indexOf(keyword) !==-1);
            }
        )
    }
    
    //get and  set
    public get BrandConverter(): AsyncReversableConverter<BrandData, Brand> | undefined {
        return this.brandConverter;
    }
    public set BrandConverter(value: AsyncReversableConverter<BrandData, Brand> | undefined) {
        this.brandConverter = value;
    }

    public get ItemManager(): EntityManager<Item, string> | undefined {
        return this.itemManager;
    }
    public set ItemManager(value: EntityManager<Item, string> | undefined) {
        this.itemManager = value;
    }
}