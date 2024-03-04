import ItemData from "../../persistence/data/ItemData";
import ReversableConverter from "../../utils/interfaces/ReversableConverter";
import Brand from "../entities/Brand";
import Item from "../entities/Item";
import ItemType from "../entities/ItemType";

export default class ItemConverter implements ReversableConverter<ItemData,Item>{
    convert(from: ItemData): Item {
        const item: Item = new Item();
        let itemType: ItemType = new ItemType();
        itemType.Id = from.type;
        const brand: Brand = new Brand();
        brand.Id = from.brand;

        item.Id = from.id;
        item.Avatar = from.avatar;
        item.Name = from.name;
        item.Description = from.description;
        item.Price = from.price;
        item.Amount = from.amount;
        item.Gender = from.gender;
        item.Metadata = (from.metadata ? JSON.parse(from.metadata) : undefined);
        item.Type = itemType;
        item.Brand = brand;

        return item;
    }
    reverse(from: Item): ItemData {
        return{
            id: from.Id as string,
            avatar: from.Avatar as string,
            name: from.Name as string,
            description: from.Description as string,
            price: from.Price as number,
            amount: from.Amount as number,
            gender: from.Gender as boolean,
            metadata: (from.Metadata ? JSON.stringify(from.Metadata) : undefined),
            type: from.Type?.Id as string,
            brand: from.Brand?.Id as string,
        }
    }

}