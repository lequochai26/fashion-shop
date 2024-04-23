import OrderData from "../../persistence/data/OrderData";
import PersistenceHandler from "../../persistence/PersistenceHandler";
import OrderItemPrimaryKey from "../../persistence/pkeys/OrderItemPrimaryKey";
import AsyncReversableConverter from "../../utils/interfaces/AsyncReversableConverter";
import Order from "../entities/upgrade/Order";
import OrderItem from "../entities/upgrade/OrderItem";
import User from "../entities/upgrade/User";
import EntityManager from "../EntityManager";
import PersistenceHandlerHolder from "../PersistenceHandlerHolder";
import SearchableEntityManager from "../SearchableEntityManager";

export default class OrderManager extends PersistenceHandlerHolder implements SearchableEntityManager<Order,string>{
    //FIELD
    private orderConverter?: AsyncReversableConverter<OrderData,Order>|undefined;
    private userManager?: EntityManager<User, string> | undefined;
    private orderItemManager?: EntityManager<OrderItem, OrderItemPrimaryKey> | undefined;
    
    
    //CONSTRUCTOR
    public constructor(
        persistenceHandler?: PersistenceHandler | undefined,
        orderConverter?: AsyncReversableConverter<OrderData,Order>|undefined,
	    userManager?:EntityManager<User, string> | undefined,
	    orderItemManager?:EntityManager<OrderItem, OrderItemPrimaryKey> | undefined
    ){
        super(persistenceHandler);
        
        this.orderConverter=orderConverter;
        this.userManager = userManager;
        this.orderItemManager = orderItemManager;
    }
    
    //PRIVATE METHODS
    private async useOrderConverter<T>(
        executable: (orderConverter: AsyncReversableConverter<OrderData,Order>) => Promise<T>
    ): Promise<T> {
        if(!this.orderConverter){
            throw new Error("orderConverter field is missing!")
        }
        return executable(this.orderConverter);
    }



    private async useUserManager<T>(
        executable: (UserManager: EntityManager<User,string>)=>Promise<T>
    ):Promise<T>{
        if(!this.userManager){
            throw new Error("userManager field is missing!")
        }
        return executable(this.userManager);
    }
    private async useOderItemManager<T>(
        executable: (OrderItemManager: EntityManager<OrderItem,OrderItemPrimaryKey>) => Promise<T>
    ):Promise<T>{
        if(!this.orderItemManager){
            throw new Error("orderItemManager field is missing!")
        }
        return executable(this.orderItemManager);
    }

    private preCheckPath(pKey:string,path:any[]){
        for(const obj of path){
            if(obj instanceof Order){
                if(obj.Id === pKey){
                    return obj;
                }
            }
        }
    }
    
    private async setupDependencies (entity: Order, path : any[]) : Promise<void> {
        // Self definition
        const self = this;

        //Items dependency
        entity.getItemsCallback = async function () {
            return self.useOderItemManager(
                async orderItemManager => orderItemManager.getByFilter({ orderId: entity.Id }, path)
            );
        }
        
        //CreatedBy dependency
        if (entity.CreatedBy) {
            entity.getCreatedByCallback = async function () {
                return self.useUserManager(
                    async userManager => userManager.get(entity.CreatedBy?.Email as string, path)
                );
            }
        }

        //OrderedBy dependency
        if (entity.OrderedBy) {
            entity.getOrderedByCallback = async function () {
                return self.useUserManager(
                    async userManager => userManager.get(entity.OrderedBy?.Email as string, path)
                );
            }
        }
        
    }

    //METHODS
    public async get(pKey: string, path: any[]): Promise<Order | undefined> {
        //Precheck path
        let entity: Order | undefined = this.preCheckPath(pKey, path);

        if(entity){
            return entity
        }

        //lay du lieu
        const data : OrderData | undefined = await this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.getOrder(pKey);
            }
        );
        
        //khong tim thay du lieu
        if(!data){
            return;
        }

        //tim thay du lieu
        //chuyen hoa du lieu thanh thuc the
        entity = await this.useOrderConverter(
            async function(orderConverter){
                return orderConverter.convert(data);
            }
        );

        //day thuc the vao path sau khi chuyen hoa
        path.push(entity);

        //cai dat su phu thuoc cho thuc the
        await this.setupDependencies(entity,path);

        //tra ve thuc the
        return entity;

    }
    public async getAll(path: any[]): Promise<Order[]> {
        //Lay toan bo du lieu cua order
        const dataList:OrderData[] | undefined = await this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.getAllOrders();
            }
        );

        //khoi tao bien result 
        const result: Order [] = [];

        //chuyen hoa du lieu tu danh datalist thanh entities 
        for(const data of dataList){
            //Precheck path
            let entity: Order | undefined = this.preCheckPath(data.id,path);
            
            if(entity){
                result.push(entity);
                continue;
            }

            //chuyen hoa data thanh entity
            entity = await this.useOrderConverter(
                async function (orderManager){
                    return orderManager.convert(data);
                }
            )

            //day entity vao trong path
            path.push(entity);

            //cai dat entity cua dependencies
            await this.setupDependencies(entity,path);

            //day entity vao result
            result.push(entity);

        
        }
        //tra ve result
        return result;
    }

    public async getByFilter(filter: any, path: any[]): Promise<Order[]> {
        //lay du lieu order
        const datalist: OrderData []= await this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.getOrdersByFilter(filter); 
            }
        );

        //khoi tao bien result
        const result: Order [] = [];

        //chuyen hoa data vao trong entity
        for(const data of datalist){
            //precheck path
            let entity: Order | undefined = this.preCheckPath(data.id,path);
            
            if(entity){
                result.push(entity);
                continue;
            }
            
            //chuyen hoa dat vao entity
            entity = await this.useOrderConverter(
                async function (orderConverter) {
                    return orderConverter.convert(data);
                }
            );

            //day entity vao path
            path.push(entity);

            //cai dat dependencies entity
            await this.setupDependencies(entity,path);

            //day entity vao result 
            result.push(entity);
        }
        return result;
    }

    public async insert(target: Order): Promise<void> {
        //khoi tao self 
        const self = this;

        return this.usePersistenceHandler(
            async function (persistenceHandler) {
                //tra ra ket qua insert
                return persistenceHandler.insertOrder(
                    await self.useOrderConverter(
                        async function(orderConverter){
                            return orderConverter.reverse(target);
                        }
                    )
                )
            }
        );
    }
    public async update(target: Order): Promise<void> {
        const self = this;

        return this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.updateOrder(
                    await self.useOrderConverter(
                        async function(orderConverter){
                            return orderConverter.reverse(target);
                        }
                    )
                )    
            }
        )
    }
    public async remove(target: Order): Promise<void> {
        const self = this;

        return this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.removeOrder(
                    await self.useOrderConverter(
                        async function(orderConverter){
                            return orderConverter.reverse(target);
                        }
                    )
                )
            }
        )
    }
    public async removeByPrimaryKey(pKey: string): Promise<void> {
        return this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.removeOrderByPrimaryKey(pKey);     
            }
        )

    }

    public async getByFilterFunc(filterFunc: (value: Order) => boolean | Promise<boolean>): Promise<Order[]> {
        const result: Order[] = [];

        for (const order of await this.getAll([])) {
            if (await filterFunc(order)) {
                result.push(order);
            }
        }

        return result;
    }

    public async search(keyword: string): Promise<Order[]> {
        return this.getByFilterFunc(
            async function (order: Order) {
                return (`${order.Id} ${order.Type} ${(await order.getCreatedBy())?.FullName} ${(await order.getOrderedBy())?.FullName} ${order.Status} ${order.PaymentMethod}`.indexOf(keyword) !== -1);
            }
        )
    }
    
    //Getter and Setter
    public get OrderConverter(): AsyncReversableConverter<OrderData,Order>|undefined{
        return this.OrderConverter;
    }
    public set OrderConverter(value: AsyncReversableConverter<OrderData,Order>|undefined){
        this.OrderConverter=value;
    }
    
    public get UserManager(): EntityManager<User, string>|undefined{
        return this.UserManager;
    }
    public set UserManager(value:EntityManager<User, string>|undefined){
        this.UserManager=value;
    }

    public get OrderItemManager(): EntityManager<OrderItem,string>|undefined{
        return this.OrderItemManager;
    }
    public set OrderItemManager(value:EntityManager<OrderItem,string>|undefined){
        this.OrderItemManager = value
    }

}