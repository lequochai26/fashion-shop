import BrandData from "../../../persistence/data/BrandData";
import AsyncReversableConverter from "../../../utils/interfaces/AsyncReversableConverter";
import Brand from "../../entities/upgrade/Brand";

export default class BrandConverter implements AsyncReversableConverter<BrandData, Brand>{
    //fields
    //constructor,tao doi tuyen ko can truyen tham so de tranh loi 
    public constructor(){

    }

    public async convert(from: BrandData): Promise<Brand> {
        const brand = new Brand();

        brand.Id = from.id;
        brand.Name = from.name;

        return brand;
       
    }
    public async reverse(from: Brand): Promise<BrandData> {
        return{
            id : from.Id as string,
            name : from.Name as string
        };
    }
    
}