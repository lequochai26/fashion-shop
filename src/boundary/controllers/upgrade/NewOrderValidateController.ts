import ItemMetadata, { Mapping } from "../../../domain/entities/ItemMetadata";
import Item from "../../../domain/entities/upgrade/Item";
import OrderPaymentMethod from "../../../domain/enums/OrderPaymentMethod";
import OrderType from "../../../domain/enums/OrderType";
import DomainManager from "../../../domain/upgrade/DomainManager";
import RestfulError from "../../errors/RestfulError";
import DomainManagerHolder from "../base_classes/upgrade/DomainManagerHolder";
import Controller from "../interfaces/Controller";

export default class NewOrderValidateController extends DomainManagerHolder implements Controller<NewOrderValidateControllerParam, NewOrderValidateControllerReturn> {
    // Constructors:
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);
    }

    // Methods:
    public async execute({ items, paymentMethod, type, totalPrice, path }: NewOrderValidateControllerParam): Promise<NewOrderValidateControllerReturn> {
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

        // Check paymentMethod
        if (paymentMethod) {
            if (paymentMethod !== OrderPaymentMethod.ETH &&
                paymentMethod !== OrderPaymentMethod.ON_RECEIVING &&
                paymentMethod !== OrderPaymentMethod.VND) { 
                throw new RestfulError(
                    "paymentMethod can only be ETH or VND or ON_RECEIVING"
                );
            }
        }

        // Check totalPrice
        if (totalPrice) {
            if (totalPrice < 0) {
                throw new RestfulError(
                    `totalPrice must be a number that greater than or equals to 0.`,
                    "TOTALPRICE_INVALID"
                );
            }
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

        // Return
        return { items, paymentMethod, type, totalPrice };
    }
}

export interface NewOrderValidateControllerParam {
    type?: string | undefined;
    items?: { id: string, amount: number, metadata: any }[] | undefined;
    paymentMethod?: string | undefined;
    totalPrice?: number | undefined;
    path: any[];
}

export interface NewOrderValidateControllerReturn {
    type: string;
    items: { id: string, amount: number, metadata: any }[];
    paymentMethod?: string | undefined;
    totalPrice?: number | undefined;
}