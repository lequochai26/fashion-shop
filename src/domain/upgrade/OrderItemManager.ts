import OrderItemData from "../../persistence/data/OrderItemData";
import PersistenceHandler from "../../persistence/PersistenceHandler";
import OrderItemPrimaryKey from "../../persistence/pkeys/OrderItemPrimaryKey";
import AsyncReversableConverter from "../../utils/interfaces/AsyncReversableConverter";
import Item from "../entities/upgrade/Item";
import Order from "../entities/upgrade/Order";
import OrderItem from "../entities/upgrade/OrderItem";
import EntityManager from "../EntityManager";
import PersistenceHandlerHolder from "../PersistenceHandlerHolder";

export default class OrderItemManager extends PersistenceHandlerHolder implements EntityManager<OrderItem,OrderItemPrimaryKey> {
    //Fields:
    private orderItemConverter: AsyncReversableConverter<OrderItemData, OrderItem> | undefined;
    private orderManager: EntityManager<Order, string> | undefined;
    private itemManager: EntityManager<Item, string> | undefined;

    //Constructor:
    public constructor(
        persistenceHandler : PersistenceHandler | undefined,
        orderItemConverter: AsyncReversableConverter<OrderItemData,OrderItem> | undefined,
        orderManager: EntityManager<Order,string> | undefined,
        itemManager: EntityManager<Item,string> | undefined
    ){
        super(persistenceHandler);
        this.orderItemConverter = orderItemConverter;
        this.orderManager = orderManager;
        this.itemManager =  itemManager;
    }

    //Private methods:
    private async useOrderItemConverter<T>(
        executable : (orderItemConverter: AsyncReversableConverter<OrderItemData,OrderItem>) => Promise<T>
    ): Promise<T> {
        if(!this.orderItemConverter) {
            throw new Error("orderItemConverter field is missing!");
        }

        return executable(this.orderItemConverter);
    }

    private async useOrderManager<T>(
        executable : (orderManager: EntityManager<Order,string>) => Promise<T>
    ) : Promise<T> {
        if(!this.orderManager) {
            throw new Error("orderManager field is missing!");
        }

        return executable(this.orderManager);
    }

    private async useItemManager<T>(
        executable : (itemManager: EntityManager<Item,string>) => Promise<T>
    ) : Promise<T> {
        if(!this.itemManager) {
            throw new Error("itemManager field is missing!");
        }

        return executable(this.itemManager);
    }

    private precheckPath(pkey: OrderItemPrimaryKey, path: any[]) : OrderItem | undefined {
        for(const obj of path) {
            if(obj instanceof OrderItem) {
                if(obj.Order?.Id as string === pkey.orderId && obj.Item?.Id as string === pkey.itemId && obj.Metadata === pkey.metadata) {
                    return obj;
                }
            }
        }
    }

    private async setupDependencies (entity: OrderItem, path: any[]) : Promise<void> {
        const self = this;

        entity.getOrderCallback = async function () {
            return self.useOrderManager(
                async orderManager => orderManager.get(entity.Order?.Id as string, path)
            );
        };

        entity.getItemCallback = async function () {
            return self.useItemManager(
                async itemManager => itemManager.get(entity.Item?.Id as string, path)
            );
        }
    }
    //Methods:
    public async get (pkey: OrderItemPrimaryKey,path: any[]): Promise<OrderItem | undefined> {
        //precheck path
        let entity: OrderItem | undefined = this.precheckPath(pkey, path);

        if(entity) {
            return entity;
        }

        //Get data
        const data : OrderItemData | undefined = await this.usePersistenceHandler(
            async function(persistenceHandler) {
                return persistenceHandler.getOrderItem(pkey);
            }
        )

        //Data not found case
        if(!data){
            return;
        }

        //Convert data to entity if found
        entity = await this.useOrderItemConverter(
            async function (orderItemConverter) {
                return orderItemConverter.convert(data);
            }
        )

        //Push entity into path
        path.push(entity);

        //Setup entity's dependencies
        await this.setupDependencies(entity,path);

        //Return entity
        return entity;
    }

    public async getAll(path: any[]) : Promise<OrderItem[]> {
        //Get all order item data
        const dataList: OrderItemData[] = await this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.getAllOrderItems();
            }
        );

        //Result initialization
        const result : OrderItem[] = [];

        //Converting data from data list to entities
        for(const data of dataList) {
            //Precheck path
            let entity: OrderItem | undefined = this.precheckPath({orderId: data.orderId, itemId: data.itemId, metadata: data.metadata}, path);

            if(entity) {
                result.push(entity);
                continue;
            }

            //Convert data to entity
            entity = await this.useOrderItemConverter(
                async function (orderItemConverter) {
                    return orderItemConverter.convert(data);
                }
            )

            //Push entity into path
            path.push(entity);

            //Setup entity's dependencies
            await this.setupDependencies(entity,path);

            //Push entity to result
            result.push(entity);
        }
        //Return result
        return result;
    }

    public async getByFilter(filter: any, path: any[]) {
        //Get order item data
        const dataList: OrderItemData[] = await this.usePersistenceHandler(
            async function(persistenceHandler) {
                return persistenceHandler.getOrderItemsByFilter(filter);
            }
        );

        //Result initialization
        const result: OrderItem[] = [];

        //Converting data into entities
        for(const data of dataList) {
            //precheck path
            let entity: OrderItem | undefined = this.precheckPath({orderId: data.orderId, itemId: data.itemId, metadata: data.metadata}, path);

            if(entity) {
                result.push(entity);
                continue;
            }

            // Convert data into entity
            entity = await this.useOrderItemConverter(
                async function(orderItemConverter) {
                    return orderItemConverter.convert(data)
                }
            );

            // Push entity into path
            path.push(entity);

            // Setup dependencies for entity
            await this.setupDependencies(entity, path);

            // Push entity into result
            result.push(entity);
        }
        //Return result
        return result;
    }
    public async insert(target: OrderItem): Promise<void> {
        const self = this;

        return this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.insertOrderItem(

                    await self.useOrderItemConverter(
                        async function (orderItemConverter){
                            return orderItemConverter.reverse(target);
                        }
                    )

                );
            }
        )
    }

    public async update(target: OrderItem): Promise<void> {
        const self =  this;

        return this.usePersistenceHandler(
            async function(persistenceHandler) {
                return persistenceHandler.updateOrderItem(

                    await self.useOrderItemConverter(
                        async function(orderItemConverter) {
                            return orderItemConverter.reverse(target);
                        }
                    )

                );
            }
        )
    }

    public async remove(target: OrderItem): Promise<void> {
        const self = this;

        return this.usePersistenceHandler(
            async function(persistenceHandler) {
                return persistenceHandler.removeOrderItem(

                    await self.useOrderItemConverter(
                        async function(orderItemConverter) {
                            return orderItemConverter.reverse(target);
                        }
                    )
                )
            }
        )
    }

    public async removeByPrimaryKey(pKey: OrderItemPrimaryKey): Promise<void> {
        return this.usePersistenceHandler(
            async function(persistenceHandler) {
                return persistenceHandler.removeOrderItemByPrimaryKey(pKey);
            }
        )
    }

    //Getter / setter:
    public get OrderItemConverter(): AsyncReversableConverter<OrderItemData, OrderItem> | undefined {
        return this.orderItemConverter;
    }
    public set OrderItemConverter(value: AsyncReversableConverter<OrderItemData, OrderItem> | undefined) {
        this.orderItemConverter = value;
    }

    public get OrderManager(): EntityManager<Order, string> | undefined {
        return this.orderManager;
    }
    public set OrderManager(value: EntityManager<Order, string> | undefined) {
        this.orderManager = value;
    }

    public get ItemManager(): EntityManager<Item, string> | undefined {
        return this.itemManager;
    }
    public set ItemManager(value: EntityManager<Item, string> | undefined) {
        this.itemManager = value;
    }
}