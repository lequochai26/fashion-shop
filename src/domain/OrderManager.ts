import PersistenceHandler from "../persistence/PersistenceHandler";
import OrderData from "../persistence/data/OrderData";
import OrderItemPrimaryKey from "../persistence/pkeys/OrderItemPrimaryKey";
import ReversableConverter from "../utils/interfaces/ReversableConverter";
import EntityManager from "./EntityManager";
import PersistenceHandlerHolder from "./PersistenceHandlerHolder";
import UserManager from "./UserManager";
import OrderConverter from "./converters/OrderConverter";
import Order from "./entities/Order";
import OrderItem from "./entities/OrderItem";
import User from "./entities/User";

export default class OrderManager extends PersistenceHandlerHolder implements EntityManager<Order,string>{
    //FIELD
    private orderConverter?: ReversableConverter<OrderData,Order>|undefined;
    private userManager?: EntityManager<User, string> | undefined;
    private orderItemManager?: EntityManager<OrderItem, OrderItemPrimaryKey> | undefined;
    
    
    //CONSTRUCTOR
    public constructor(
        persistenceHandler?: PersistenceHandler | undefined,
        orderConverter?: ReversableConverter<OrderData,Order>|undefined,
	    userManager?:EntityManager<User, string> | undefined,
	    orderItemManager?:EntityManager<OrderItem, OrderItemPrimaryKey> | undefined
    ){
        super(persistenceHandler);
        
        this.orderConverter=orderConverter;
        this.userManager = userManager;
        this.orderItemManager = orderItemManager;
    }
    
    //PRIVATE METHODS
    private useOrderConverter<T>(
        executable: (orderConverter: ReversableConverter<OrderData,Order>) =>T
    ): T {
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
        //Items dependency
        entity.Items = await this.useOderItemManager(
            async function (orderItemManager) {
                return orderItemManager.getByFilter({item:entity.Id as string},path);
            }
        )
        
        //CreatedBy dependency
        entity.CreatedBy = await this.useUserManager(
            async function (userManager) {
                return userManager.get(entity.CreatedBy?.Email as string, path)
            }
        )

        //OrderedBy dependency
        entity.OrderedBy = await this.useUserManager(
            async function (userManager) {
                return userManager.get(entity.OrderedBy?.Email as string, path);
                
            }
        )
        
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
        entity = this.useOrderConverter(
            function(orderConverter){
                return orderConverter.convert(data);
            }
        );

        //day thuc the vao path sau khi chuyen hoa
        path.push(entity);

        //cai dat su phu thuoc cho thuc the
        this.setupDependencies(entity,path);

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
            entity = this.useOrderConverter(
                function (orderManager){
                    return orderManager.convert(data);
                }
            )

            //day entity vao trong path
            path.push(entity);

            //cai dat entity cua dependencies
            this.setupDependencies(entity,path);

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
            entity = this.useOrderConverter(
                function (orderConverter) {
                    return orderConverter.convert(data);
                }
            );

            //day entity vao path
            path.push(entity);

            //cai dat dependencies entity
            this.setupDependencies(entity,path);

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
                    self.useOrderConverter(
                        function(orderConverter){
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
                    self.useOrderConverter(
                        function(orderConverter){
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
                    self.useOrderConverter(
                        function(orderConverter){
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
    
    //Getter and Setter
    public get OrderConverter(): ReversableConverter<OrderData,Order>|undefined{
        return this.OrderConverter;
    }
    public set OrderConverter(value: ReversableConverter<OrderData,Order>|undefined){
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