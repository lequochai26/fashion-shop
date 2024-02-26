import ItemTypeData from "../../persistence/data/ItemTypeData";
import ReversableConverter from "../../utils/interfaces/ReversableConverter";
import ItemType from "../entities/ItemType";

export default class ItemTypeConverter implements ReversableConverter<ItemTypeData,ItemType>{
    //field
    
    //constructor
    public constructor(){

    }

    public convert(from: ItemTypeData): ItemType { //đối số(gitri tr vao khi goi ham) from kiểu ItemType
        const itemType = new ItemType;

        itemType.Id = from.id;
        itemType.Name = from.name;

        return itemType;
    }
    public reverse(from: ItemType): ItemTypeData {
        return{
            id : from.Id as string,
            name : from.Name as string
        };
    }
    
}