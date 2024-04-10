import DomainManager from "../../domain/DomainManager";
import Item from "../../domain/entities/Item";
import ItemMetadata, { Mapping } from "../../domain/entities/ItemMetadata";
import OrderPaymentMethod from "../../domain/enums/OrderPaymentMethod";
import OrderType from "../../domain/enums/OrderType";
import RestfulError from "../errors/RestfulError";
import Controller from "./interfaces/Controller";

export default class NewOrderValidateController implements Controller<NewOrderValidateControllerParam, NewOrderValidateControllerReturn> {
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

        return executable(this.domainManager);
    }

    // Methods:
    public async execute({ items, paymentMethod, type, path }: NewOrderValidateControllerParam): Promise<NewOrderValidateControllerReturn> {
        // Check type
        if (!type) {
            throw new RestfulError(
                "type parameter is required!",
                "TYPE_REQUIRED"
            );
        }

        if (type !== OrderType.BUY && type !== OrderType.SELL) {
            throw new RestfulError(
                "type can only be BUY or SELL",
                "TYPE_INVALID"
            );
        }

        // Check items
        if (!items) {
            throw new RestfulError(
                "items parameter is required!",
                "ITEM_REQUIRED"
            );
        }

        for (const { amount, id, metadata } of items) {
            // Check Item entity exist
            const item: Item | undefined = await this.useDomainManager(
                async domainManager => domainManager.getItem(id, path)
            );

            // Item not exist
            if (!item) {
                throw new RestfulError(
                    `Item with id ${id} not exist!`,
                    "ITEM_NOT_EXIST"
                );
            }

            // No metadata case
            if (!metadata) {
                if (type === OrderType.SELL) {
                    if (item.Amount as number < amount) {
                        throw new RestfulError(
                            `Item with id ${id} not enough amount to serve this order.`,
                            "ITEM_NOT_ENOUGH_AMOUNT"
                        );
                    }
                }
            }
            // Have metadata case
            else {
                // Get metadata from item
                const itemMetadata: ItemMetadata | undefined = item.Metadata;

                // Item no metadata
                if (!itemMetadata) {
                    throw new RestfulError(
                        `Item with id ${id} has no metadata!`,
                        "ITEM_NO_METDATA"
                    );
                }

                // Get mapping from metadata
                const mapping: Mapping | undefined = itemMetadata.getMapping(metadata);

                // Mapping not exist case
                if (!mapping) {
                    throw new RestfulError(
                        `metdata invalid`,
                        `METADATA_INVALID`
                    );
                }

                // Check amount if type is SELL
                if (type === OrderType.SELL) {
                    if (mapping.amount < amount) {
                        throw new RestfulError(
                            `Item with id ${id} not enough amount to serve this order.`,
                            "ITEM_NOT_ENOUGH_AMOUNT"
                        );
                    }
                }
            }
        }

        // Check paymentMethod
        if (paymentMethod) {
            if (paymentMethod !== OrderPaymentMethod.ETH && paymentMethod !== OrderPaymentMethod.ON_RECEIVING && paymentMethod !== OrderPaymentMethod.VND) { 
                throw new RestfulError(
                    "paymentMethod can only be ETH or VND or ON_RECEIVING"
                );
            }
        }

        // Return
        return { items, paymentMethod, type };
    }
}

export interface NewOrderValidateControllerParam {
    type: string | undefined;
    items: { id: string, amount: number, metadata: any }[] | undefined;
    paymentMethod: string | undefined;
    path: any[]
}

export interface NewOrderValidateControllerReturn {
    type: string;
    items: { id: string, amount: number, metadata: any }[];
    paymentMethod: string | undefined;
}