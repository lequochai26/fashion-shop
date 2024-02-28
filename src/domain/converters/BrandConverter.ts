import BrandData from "../../persistence/data/BrandData";
import ReversableConverter from "../../utils/interfaces/ReversableConverter";
import Brand from "../entities/Brand";
import Item from "../entities/Item";

export default class BrandConverter implements ReversableConverter<BrandData,Brand>{
    //fields
    //constructor,tao doi tuyen ko can truyen tham so de tranh loi 
    public constructor(){

    }

    public convert(from: BrandData): Brand {
        const brand = new Brand();


        brand.Id = from.id;
        brand.Name = from.name;

        return brand;
       
    }
    public reverse(from: Brand): BrandData {
        return{
            id : from.Id as string,
            name : from.Name as string
        };
    }
    
}