import { Document, WithId } from "mongodb";
import Converter from "../../utils/interfaces/Converter";
import ItemTypeData from "../data/ItemTypeData";

export default class ItemTypeDataConverter implements Converter<WithId<Document>, ItemTypeData>{
    
    //constructer de để tránh lỗi khi tạo đối tượng mà không truyền vào tham số.
    public constructor(){

    }
    public convert(from: WithId<Document>): ItemTypeData {
        return{
            id: from.id,
            name: from.name
        }

    };
   
   
    
}