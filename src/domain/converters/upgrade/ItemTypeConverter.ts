import ItemTypeData from "../../../persistence/data/ItemTypeData";
import AsyncReversableConverter from "../../../utils/interfaces/AsyncReversableConverter";
import ItemType from "../../entities/upgrade/ItemType";

export default class ItemTypeConverter implements AsyncReversableConverter<ItemTypeData,ItemType>{
    //field
    
    //constructor
    public constructor(){

    }

    public async convert(from: ItemTypeData): Promise<ItemType> { //đối số(gitri tr vao khi goi ham) from kiểu ItemType
        const itemType = new ItemType;

        itemType.Id = from.id;
        itemType.Name = from.name;

        return itemType;
    }
    public async reverse(from: ItemType): Promise<ItemTypeData> {
        return{
            id : from.Id as string,
            name : from.Name as string
        };
    }
    
}