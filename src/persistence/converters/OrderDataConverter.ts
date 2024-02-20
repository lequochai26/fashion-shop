import { WithId,Document} from "mongodb";
import OrderData from "../data/OrderData";
import ItemData from "../data/ItemData";
import Converter from "../../utils/interfaces/Converter";

export default class ItemDataConverter implements Converter<WithId<Document>,OrderData>{

    public convert(document: WithId<Document>): OrderData {
        return{
            id: document.id,
        }
    }
}