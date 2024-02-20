import { Document, WithId } from "mongodb";
import Converter from "../../utils/interfaces/Converter";
import ItemImageData from "../data/ItemImageData";


export default class ItemImageDataConverter implements Converter<WithId<Document>,ItemImageData> {
    public convert(document: WithId<Document>): ItemImageData {
        return {
            path: document.path,
            itemId: document.itemId,
        }
    }
}