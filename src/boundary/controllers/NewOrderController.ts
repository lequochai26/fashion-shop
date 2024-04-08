import DomainManager from "../../domain/DomainManager";
import Item from "../../domain/entities/Item";
import ItemMetadata, { Mapping } from "../../domain/entities/ItemMetadata";
import Order from "../../domain/entities/Order";
import OrderItem from "../../domain/entities/OrderItem";
import User from "../../domain/entities/User";
import OrderType from "../../domain/enums/OrderType";
import RestfulController from "./abstracts/RestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";

export default class NewOrderController extends RestfulController {
    // Constructors:
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);
    }

    // Methods:
    public async execute(param: RestfulControllerParam): Promise<void> {
        // Get request and response from param
        const { request, response } = param;

        // Get type
        const type: any | undefined = request.body.type;

        if (!type) {
            response.json({
                success: false,
                message: "type parameter is required!",
                code: "TYPE_REQUIRED"
            });
            return;
        }

        if (type !== OrderType.BUY && type !== OrderType.SELL) {
            response.json({
                success: false,
                message: "type parameter can only be BUY or SELL",
                code: "TYPE_INVALID"
            });
            return;
        }

        // SELL ORDER HANDLE
        if (type === OrderType.SELL) {
            return this.handleSellOrder(param);
        }
        // BUY ORDER HANDLE
        else {
            return this.handleBuyOrder(param);
        }
    }

    // Private methods:
    private async handleSellOrder({ request, response }: RestfulControllerParam): Promise<void> {
        // Get items from request
        const items: { id: string, amount: number, metadata: any }[] | undefined = request.body.items;

        // Items undefined case
        if (!items) {
            response.json({
                success: false,
                message: "items parameter is required!",
                code: "ITEMS_REQUIRED"
            });
            return;
        }

        // Path initialize
        const path: any[] = [];

        // Storage of order items initialize
        const orderItems: OrderItem [] = [];

        // Precheck items and create order items
        for (const { id, amount, metadata } of items) {
            // Check item's amount
            if (amount < 1) {
                response.json({
                    success: false,
                    message: "Order's item amount must be greater than 0!",
                    code: "AMOUNT_INVALID"
                });
                return;
            }

            // Get item entity
            let item: Item | undefined = undefined;
            try {
                item = await this.useDomainManager(
                    async domainManager => domainManager.getItem(id, path)
                );
            }
            catch (error: any) {
                console.error(error);
                response.json({
                    success: false,
                    message: "Failed while handling with DB!",
                    code: "HANDLING_DB_FAILED"
                });
                return;
            }

            // Item not found
            if (!item) {
                response.json({
                    success: false,
                    message: `Item with id ${id} not exist!`,
                    code: "ITEM_NOT_EXIST"
                });
                return;
            }

            // No metadata case
            if (!metadata) {
                if (item.Amount as number < amount) {
                    response.json({
                        success: false,
                        message: `Item with id ${id} doesn't have enough amount to serve this order!`,
                        code: "ITEM_AMOUNT_NOT_ENOUGH"
                    });
                    return;
                }
            }
            // Have metadata case
            else {
                // Get Item's metadata
                const itemMetadata: ItemMetadata | undefined = item.Metadata;
                
                // Item doesn't have metadata case
                if (!itemMetadata) {
                    response.json({
                        success: false,
                        message: `Item with id ${id} doesn't have metadata!`,
                        code: "ITEM_NO_METADATA"
                    });
                    return;
                }

                // Get mapping
                const mapping: Mapping | undefined = itemMetadata.getMapping(metadata);

                // Mapping not exist
                if (!mapping) {
                    response.json({
                        success: false,
                        message: `Item with id ${id} doesn't have such metadata mapping.`,
                        code: "METADATA_INVALID"
                    });
                    return;
                }

                // Check mapping's amount
                if (mapping.amount < amount) {
                    response.json({
                        success: false,
                        message: `Item with id ${id} doesn't have enough amount to serve this order!`,
                        code: "ITEM_AMOUNT_NOT_ENOUGH"
                    });
                    return;
                }
            }

            // Order items initialize
            const orderItem: OrderItem = new OrderItem();

            orderItem.Amount = amount;
            orderItem.Item = item;
            orderItem.Metadata = metadata;

            // Push orderItem into orderItems
            orderItems.push(orderItem);
        }

        // Create order
        const order: Order = new Order();

        // Id
        order.autoId();

        // CreatedBy
        // TODO

        // Date
        order.Date = new Date();

        // Items
        order.Items = orderItems;

        // OrderedBy
        const orderedBy: string | undefined = request.body.orderedBy;
        if (orderedBy) {
            let user: User | undefined = undefined;
            try {
                user = await this.useDomainManager(
                    async domainManager => domainManager.getUser(orderedBy, path)
                );
            }
            catch (error: any) {
                console.error(error);
                response.json({
                    success: false,
                    message: "Failed while handling with DB!",
                    code: "HANDLING_DB_FAILED"
                });
                return;
            }

            if (!user) {
                response.json({
                    success: false,
                    message: `User with email ${orderedBy} doesn't exist!`,
                    code: "USER_NOT_EXIST"
                });
                return;
            }

            order.OrderedBy = user;
        }

        // TotalPrice
        order.calcTotalPrice();

        // Type
        order.Type = request.body.type;

        // Insert order
        try {
            await this.useDomainManager(
                async domainManager => domainManager.insertOrder(order)
            );
        }
        catch (error: any) {
            console.error(error);
            response.json({
                success: false,
                message: "Failed while handling with DB!",
                code: "HANDLING_DB_FAILED"
            });
            return;
        }

        // Insert order items
        for (const orderItem of orderItems) {
            orderItem.Order = order;
            try {
                await this.useDomainManager(
                    async domainManager => domainManager.insertOrderItem(orderItem)
                );
            }
            catch (error: any) {
                console.error(error);
                response.json({
                    success: false,
                    message: "Failed while handling with DB!",
                    code: "HANDLING_DB_FAILED"
                });
                return;
            }
        }

        // Update item's amount
        for (const orderItem of orderItems) {
            const item: Item = orderItem.Item as Item;

            // No metadata case
            if (!orderItem.Metadata) {
                item.Amount = (item.Amount as number) - (orderItem.Amount as number);
            }
            else {
                const mapping = item.Metadata?.getMapping(orderItem.Metadata) as Mapping;
                mapping.amount -= orderItem.Amount as number;
            }

            try {
                await this.useDomainManager(
                    async domainManager => domainManager.updateItem(item)
                );
            }
            catch (error: any) {
                console.error(error);
                response.json({
                    success: false,
                    message: "Failed while handling with DB!",
                    code: "HANDLING_DB_FAILED"
                });
                return;
            }
        }

        // Response
        response.json({ success: true });
    }

    private async handleBuyOrder({ request, response }: RestfulControllerParam): Promise<void> {
        // Get items from request
        const items: { id: string, amount: number, metadata: any }[] | undefined = request.body.items;

        // Items undefined case
        if (!items) {
            response.json({
                success: false,
                message: "items parameter is required!",
                code: "ITEMS_REQUIRED"
            });
            return;
        }

        // Path initialize
        const path: any[] = [];

        // Order items storage initialize
        const orderItems: OrderItem [] = [];

        // Creating order items
        for (const { id, amount, metadata } of items) {
            // Get item with given id
            let item: Item | undefined = undefined;
            try {
                item = await this.useDomainManager(
                    async domainManager => domainManager.getItem(id, path)
                );
            }
            catch (error: any) {
                console.error(error);
                response.json({
                    success: false,
                    message: "Failed while handling with DB!",
                    code: "HANDLING_DB_FAILED"
                });
                return;
            }

            // Item not exist
            if (!item) {
                response.json({
                    success: false,
                    message: `Item with id ${id} doesn't exist!`,
                    code: "ITEM_NOT_EXIST"
                });
                return;
            }

            // Have metadata case
            if (metadata) {
                // Item doesn't have metadata case
                const itemMetadata: ItemMetadata | undefined = item.Metadata;

                if (!itemMetadata) {
                    response.json({
                        success: false,
                        message: `Item with id ${id} doesn't have metadata!`,
                        code: "ITEM_NO_METADATA"
                    });
                    return;
                }

                // Get mapping
                const mapping: Mapping | undefined = itemMetadata.getMapping(metadata);

                // Mapping not exist case
                if (!mapping) {
                    response.json({
                        success: false,
                        message: `Item with id ${id} doesn't have such metadata mapping.`,
                        code: "METADATA_INVALID"
                    });
                    return;
                }
            }

            // Create order item
            const orderItem: OrderItem = new OrderItem();

            orderItem.Item = item;
            orderItem.Amount = amount;
            orderItem.Metadata = metadata;
            
            // Push orderItem into orderItems
            orderItems.push(orderItem);
        }

        // Create new Order
        const order: Order = new Order();

        // Id
        order.autoId();

        // Type
        order.Type = request.body.type;

        // Date
        order.Date = new Date();

        // CreatedBy
        // TODO

        // Items
        order.Items = orderItems;

        // TotalPrice
        order.calcTotalPrice();

        // Insert order
        try {
            await this.useDomainManager(
                async domainManager => domainManager.insertOrder(order)
            );
        }
        catch (error: any) {
            console.error(error);
            response.json({
                success: false,
                message: "Failed while handling with DB!",
                code: "HANDLING_DB_FAILED"
            });
            return;
        }

        // Insert order items
        for (const orderItem of orderItems) {
            orderItem.Order = order;
            try {
                await this.useDomainManager(
                    async domainManager => domainManager.insertOrderItem(orderItem)
                );
            }
            catch (error: any) {
                console.error(error);
                response.json({
                    success: false,
                    message: "Failed while handling DB!",
                    code: "HANDLING_DB_FAILED"
                });
                return;
            }
        }

        // Update item's amount
        for (const orderItem of orderItems) {
            const item: Item = orderItem.Item as Item;

            // No metadata case
            if (!orderItem.Metadata) {
                item.Amount = (item.Amount as number) + (orderItem.Amount as number);
            }
            else {
                const mapping: Mapping = item.Metadata?.getMapping(orderItem.Metadata) as Mapping;
                mapping.amount += orderItem.Amount as number;
            }

            try {
                await this.useDomainManager(
                    async domainManager => domainManager.updateItem(item)
                );
            }
            catch (error: any) {
                console.error(error);
                response.json({
                    success: false,
                    message: "Failed while handling with DB!",
                    code: "HANDLING_DB_FAILED"
                });
                return;
            }
        }

        // Response
        response.json({ success: true });
    }
}