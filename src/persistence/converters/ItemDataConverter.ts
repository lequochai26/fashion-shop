import { WithId ,Document} from "mongodb";
import Converter from "../../utils/interfaces/Converter";
import ItemData from "../data/ItemData";

export default class ItemDataConverter implements Converter<WithId<Document>,ItemData>{
    public constructor(){}

    public convert(document: WithId<Document>): ItemData {
        return{
            id: document.id,
            avatar: document.avatar,
            name: document.name,   
            description: document.description,    
            price: document.price,
            buyPrice: document.buyPrice,
            amount: document.amount,    
            gender: document.gender,   
            metadata: document.metadata, 
            type: document.type,   
            brand: document.brand,
        }
    }
}

