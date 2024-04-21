import ItemData from "../../../persistence/data/ItemData";
import AsyncReversableConverter from "../../../utils/interfaces/AsyncReversableConverter";
import ItemMetadata from "../../entities/ItemMetadata";
import Brand from "../../entities/upgrade/Brand";
import Item from "../../entities/upgrade/Item";
import ItemType from "../../entities/upgrade/ItemType";

export default class ItemConverter implements AsyncReversableConverter<ItemData,Item>{
    public async convert(from: ItemData): Promise<Item> {
        const item: Item = new Item();
        item.Id = from.id;
        item.Avatar = from.avatar;
        item.Name = from.name;
        item.Description = from.description;
        item.Price = from.price;
        item.BuyPrice = from.buyPrice;
        item.Amount = from.amount;
        item.Gender = from.gender;
        item.Metadata = (from.metadata ? new ItemMetadata(JSON.parse(from.metadata)) : undefined);

        if (from.type) {
            const type: ItemType = new ItemType();
            (type as any).fromConverter = true;
            type.Id = from.type;
            item.Type = type;
        }

        if (from.brand) {
            const brand: Brand = new Brand();
            (brand as any).fromConverter = true;
            brand.Id = from.brand;
            item.Brand = brand;
        }

        return item;
    }
    public async reverse(from: Item): Promise<ItemData> {
        return{
            id: from.Id as string,
            avatar: from.Avatar as string,
            name: from.Name as string,
            description: from.Description as string,
            price: from.Price as number,
            buyPrice: from.BuyPrice as number,
            amount: from.Amount as number,
            gender: from.Gender as boolean,
            metadata: (from.Metadata ? JSON.stringify(from.Metadata.toJSON()) : undefined),
            type: (await from.getType())?.Id,
            brand: (await from.getBrand())?.Id,
        }
    }

}