import DomainManager from "./DomainManager";
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
        createdBy?: string | undefined,
        orderedBy?: string | undefined
    ): Promise<void> {
        
    }

    private async newBuyOrder(
        type: string,
        items: { id: string, amount: number, metadata: any }[],
        createdBy?: string | undefined,
        orderedBy?: string | undefined
    ): Promise<void> {

    }

    // Methods:
    public async newOrder(
        type: string,
        items: { id: string, amount: number, metadata: any }[],
        createdBy?: string | undefined,
        orderedBy?: string | undefined
    ): Promise<void> {
        // Type sell
        if ((type as OrderType) === OrderType.SELL) {
            return this.newSellOrder(type, items, createdBy, orderedBy);
        }
        // Type buy
        else {
            return this.newBuyOrder(type, items, createdBy, orderedBy);
        }
    }
}

class OrderHandlerError extends Error {
    // Fields:
    public code: string;

    // Constructors:
    public constructor(message: string, code: string) {
        super(message);

        this.code = code;
    }
}