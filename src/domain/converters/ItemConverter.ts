import ItemData from "../../persistence/data/ItemData";
import ReversableConverter from "../../utils/interfaces/ReversableConverter";
import Brand from "../entities/Brand";
import Item from "../entities/Item";
import ItemType from "../entities/ItemType";

export default class ItemConverter implements ReversableConverter<ItemData,Item>{
    convert(from: ItemData): Item {
        const item: Item = new Item();
        const itemType: ItemType = new ItemType();
        const brand: Brand = new Brand();

        item.Id = from.id;
        item.Avatar = from.avatar;
        item.Name = from.name;
        item.Description = from.description;
        item.Price = from.price;
        item.Amount = from.amount;
        item.Gender = from.gender;
        item.MetaData = from.metadata;
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
            metadata: from.MetaData as string,
            type: from.Type?.Id as string,
            brand: from.Brand?.Id as string,

        }
    }

}