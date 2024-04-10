import DomainManager from "./DomainManager";
import Item from "./entities/Item";
import { Mapping } from "./entities/ItemMetadata";
import Order from "./entities/Order";
import OrderItem from "./entities/OrderItem";
import OrderPaymentMethod from "./enums/OrderPaymentMethod";
import OrderStatus from "./enums/OrderStatus";
import OrderType from "./enums/OrderType";

export default class OrderHandler {
    // Fields:
    private domainManager?: DomainManager | undefined;

    // Constructors:
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        this.domainManager = domainManager;
    }

    // Private methods:
    private async useDomainManager<T>(
        executable: (domainManager: DomainManager) => Promise<T>
    ): Promise<T> {
        if (!this.domainManager) {
            throw new Error("domainManager field is missing!");
        }

        return executable(this.domainManager );
    }

    private async newSellOrder(param: OrderHandlerParam): Promise<void> {
        // Default value
        this.defaultValue(param);

        // Dustruct param
        const { items, path, type, createdBy, orderedBy, paymentMethod, status, totalPrice }: OrderHandlerParam = param;

        // Create OrderItems
        const orderItems: OrderItem[] = [];

        for (const { id, amount, metadata } of items) {
            // Get item
            const item: Item | undefined = await this.useDomainManager(
                async domainManager => domainManager.getItem(id, path)
            );

            // Create OrderItem entity
            const orderItem: OrderItem = new OrderItem();
            orderItem.Item = item;
            orderItem.Amount = amount;
            orderItem.Metadata = metadata;

            // Push into orderItems
            orderItems.push(orderItem);
        }

        // Create Order
        const order: Order = new Order();
        order.autoId();
        if (createdBy) {
            order.CreatedBy = await this.useDomainManager(
                async domainManager => domainManager.getUser(createdBy, path)
            );
        }
        order.Date = new Date();
        order.Items = orderItems;
        if (orderedBy) {
            order.OrderedBy = await this.useDomainManager(
                async domainManager => domainManager.getUser(orderedBy, path)
            );
        }
        order.Status = status;
        order.TotalPrice = totalPrice || order.calcTotalPrice(type as OrderType);
        order.Type = type;
        order.PaymentMethod = paymentMethod;

        // Insert order
        await this.useDomainManager(
            async domainManager => domainManager.insertOrder(order)
        );

        // Insert orderItems
        for (const orderItem of orderItems) {
            orderItem.Order = order;
            await this.useDomainManager(
                async domainManager => domainManager.insertOrderItem(orderItem)
            );
        }

        // Updating Items amount
        for (const orderItem of orderItems) {
            const item: Item = orderItem.Item as Item;

            if (!orderItem.Metadata) {
                item.Amount = (item.Amount as number) - (orderItem.Amount as number);
            }
            else {
                const mapping: Mapping = item.Metadata?.getMapping(orderItem.Metadata) as Mapping;

                mapping.amount -= orderItem.Amount as number;
            }

            await this.useDomainManager(
                async domainManager => domainManager.updateItem(item)
            );
        }
    }

    private async newBuyOrder(param: OrderHandlerParam): Promise<void> {
        // Default value
        this.defaultValue(param);

        // Destruct param
        const { items, path, type, createdBy, orderedBy, paymentMethod, status, totalPrice }: OrderHandlerParam = param;

        // Create OrderItems
        const orderItems: OrderItem[] = [];

        for (const { id, amount, metadata } of items) {
            // Get Item
            const item: Item | undefined = await this.useDomainManager(
                async domainManager => domainManager.getItem(id, path)
            );

            // Create OrderItem
            const orderItem: OrderItem = new OrderItem();
            orderItem.Item = item;
            orderItem.Amount = amount;
            orderItem.Metadata = metadata;

            // Push into orderItems
            orderItems.push(orderItem);
        }

        // Create Order
        const order: Order = new Order();
        order.autoId();
        order.CreatedBy = createdBy ? await this.useDomainManager(
            async domainManager => domainManager.getUser(createdBy, path)
        ) : undefined;
        order.Date = new Date();
        order.Items = orderItems;
        order.OrderedBy = orderedBy ? await this.useDomainManager(
            async domainManager => domainManager.getUser(orderedBy, path)
        ) : undefined;
        order.Status = status;
        order.TotalPrice = totalPrice || order.calcTotalPrice(type as OrderType);
        order.Type = type;
        order.PaymentMethod = paymentMethod;

        // Insert order
        await this.useDomainManager(
            async domainManager => domainManager.insertOrder(order)
        );

        // Insert orderItems
        for (const orderItem of orderItems) {
            orderItem.Order = order;
            await this.useDomainManager(
                async domainManager => domainManager.insertOrderItem(orderItem)
            );
        }

        // Update Items amount
        for (const orderItem of orderItems) {
            const item: Item = orderItem.Item as Item;

            if (!orderItem.Metadata) {
                item.Amount = (item.Amount as number) + (orderItem.Amount as number);
            }
            else {
                const mapping: Mapping = item.Metadata?.getMapping(orderItem.Metadata) as Mapping;

                mapping.amount += orderItem.Amount as number;
            }

            await this.useDomainManager(
                async domainManager => domainManager.updateItem(item)
            );
        }
    }

    private defaultValue(param: OrderHandlerParam): void {
        if (!param.status) {
            param.status = OrderStatus.SUCCESS;
        }

        if (!param.paymentMethod) {
            if (param.type === OrderType.SELL) {
                param.paymentMethod = OrderPaymentMethod.ON_RECEIVING;
            }
        }
    }

    // Methods:
    public async newOrder(param: OrderHandlerParam): Promise<void> {
        // Get type from param
        const { type } = param;

        // Type sell
        if ((type as OrderType) === OrderType.SELL) {
            return this.newSellOrder(param);
        }
        // Type buy
        else if ((type as OrderType) === OrderType.BUY) {
            return this.newBuyOrder(param);
        }
        // Invalid type
        else {
            throw new Error(`Type ${type} is invalid!`);
        }
    }
}

export type OrderHandlerParam = {
    type: string,
    items: { id: string, amount: number, metadata: any }[],
    path: any[],
    status?: string | undefined,
    paymentMethod?: string | undefined,
    totalPrice?: number | undefined,
    createdBy?: string | undefined,
    orderedBy?: string | undefined
}