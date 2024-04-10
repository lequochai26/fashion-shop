import DomainManager from "../../domain/DomainManager";
import Item from "../../domain/entities/Item";
import ItemMetadata, { Mapping } from "../../domain/entities/ItemMetadata";
import OrderType from "../../domain/enums/OrderType";
import RestfulController from "./abstracts/RestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";

export default class UpgradedNewOrderController extends RestfulController {
    // Constructors:
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);
    }

    // Methods:
    public async execute({ request, response }: RestfulControllerParam): Promise<void> {
        // Type
        const type: string | undefined = request.body.type;

        if (!type) {
            response.json({
                success: false,
                message: "type parameter is required!",
                code: "TYPE_REQUIRED"
            });
            return;
        }

        if ((type as OrderType) !== OrderType.SELL && (type as OrderType) !== OrderType.BUY) {
            response.json({
                success: false,
                message: "type can only be SELL or BUY!",
                code: "TYPE_INVALID"
            });
            return;
        }

        // Items
        const items: { id: string, amount: number, metadata: any[] }[] | undefined = request.body.items;

        if (!items) {
            response.json({
                success: false,
                message: "items parameter is required!",
                code: "ITEMS_REQUIRED"
            });
            return;
        }

        if (items.length < 1) {
            response.json({
                success: false,
                message: "items can not be empty!",
                code: "ITEMS_EMPTY"
            });
            return;
        }

        // Path initialize
        const path: any[] = [];

        for (const { id, amount, metadata } of items) {
            // Get Item from id
            const item: Item | undefined = await this.useDomainManager(
                async domainManager => domainManager.getItem(id, path)
            );

            // Item not found case
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
                // SELL amount validation
                if ((type as OrderType) === OrderType.SELL) {
                    if (item.Amount as number < amount) {
                        response.json({
                            success: false,
                            message: `Item with id ${id} not enough amount to serve this order!`,
                            code: "ITEM_NOT_ENOUGH_AMOUNT"
                        });
                        return;
                    }
                }
            }
            // Have metadata case
            else {
                // Get item's metadata
                const itemMetadata: ItemMetadata | undefined = item.Metadata;

                // Item no metadata case
                if (!itemMetadata) {
                    response.json({
                        success: false,
                        message: `Item with id ${id} have no metadata!`,
                        code: "ITEM_NO_METADATA"
                    });
                    return;
                }

                // Get mapping
                const mapping: Mapping | undefined = itemMetadata.getMapping(metadata);

                // No mapping case
                if (!mapping) {
                    response.json({
                        success: false,
                        message: `metadata invalid!`,
                        code: "METADATA_INVALID"
                    });
                    return;
                }

                // Amount validation for SELL
                if ((type as OrderType) === OrderType.SELL) {
                    if (mapping.amount < amount) {
                        response.json({
                            success: false,
                            message: `Item with id ${id} not enough amount to serve this order!`,
                            code: "ITEM_NOT_ENOUGH_AMOUNT"
                        });
                        return;
                    }
                }
            }
        }

        try {
            // orderedBy precheck
            const orderedBy: string | undefined = request.body.orderedBy;

            if (orderedBy) {
                if (!await this.useDomainManager(async domainManager => domainManager.getUser(orderedBy, path))) {
                    response.json({
                        success: false,
                        message: `User with email ${orderedBy} not exist!`,
                        code: "USER_NOT_EXIST"
                    });
                    return;
                }
            }

            await this.useDomainManager(
                async domainManager => domainManager.newOrder({ items, path, type })
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

        // Response
        response.json({ success: true });
    }
}