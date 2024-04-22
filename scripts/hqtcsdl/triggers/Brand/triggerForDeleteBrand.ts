import Item from "../../collections/Item";
import Trigger from "../../types/Trigger";

const triggerForDeleteBrand: Trigger = async function (inserted, deleted) {
    // Update brand field of items belong to this brand to undefined
    const items: any[] = await Item.select({ brand: deleted.id });

    for (const item of items) {
        await Item.update(
            item.id,
            item.avatar,
            item.name,
            item.description,
            item.price,
            item.buyPrice,
            item.amount,
            item.gender,
            item.metadata,
            item.type,
            undefined
        );
    }
}

export default triggerForDeleteBrand;