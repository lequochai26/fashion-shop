import DomainManager from "./DomainManager";
import Item from "./entities/Item";
import { Mapping } from "./entities/ItemMetadata";
import Order from "./entities/Order";
import OrderItem from "./entities/OrderItem";
import User from "./entities/User";
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

    private async newSellOrder(
        type: string,
        items: { id: string, amount: number, metadata: any }[],
        path: any[],
        createdBy?: string | undefined,
        orderedBy?: string | undefined,
        status?: string | undefined
    ): Promise<void> {
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
        order.calcTotalPrice();
        order.Type = type;

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

    private async newBuyOrder(
        type: string,
        items: { id: string, amount: number, metadata: any }[],
        path: any[],
        createdBy?: string | undefined,
        orderedBy?: string | undefined,
        status?: string | undefined
    ): Promise<void> {
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
        order.calcTotalPrice();
        order.Type = type;

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

    // Methods:
    public async newOrder(
        type: string,
        items: { id: string, amount: number, metadata: any }[],
        path: any[],
        createdBy?: string | undefined,
        orderedBy?: string | undefined,
        status?: string | undefined
    ): Promise<void> {
        // Type sell
        if ((type as OrderType) === OrderType.SELL) {
            return this.newSellOrder(type, items, path, createdBy, orderedBy, status);
        }
        // Type buy
        else if ((type as OrderType) === OrderType.BUY) {
            return this.newBuyOrder(type, items, path, createdBy, orderedBy, status);
        }
        // Invalid type
        else {
            throw new Error(`Type ${type} is invalid!`);
        }
    }
}