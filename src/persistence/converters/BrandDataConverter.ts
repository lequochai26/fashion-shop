import { Document, WithId } from "mongodb";
import Converter from "../../utils/interfaces/Converter";
import BrandData from "../data/BrandData";

export default class BrandDataConverter implements Converter<WithId<Document>,BrandData>{
    //constructor
    public constructor(){

    }
    //method
    public convert(from: WithId<Document>): BrandData {
        return{
            id: from.id,
            name: from.name
        }
    }
    
}