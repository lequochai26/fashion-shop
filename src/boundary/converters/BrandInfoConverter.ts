import Brand from "../../domain/entities/Brand";
import Converter from "../../utils/interfaces/Converter";
import BrandInfo from "../infos/brand/BrandInfo";

export default class BrandInfoConverter implements Converter<Brand, BrandInfo> {
    // Constructors:
    public constructor() {

    }

    // Methods:
    public convert(from: Brand): BrandInfo {
        return {
            id: from.Id as string,
            name: from.Name as string,
            items: from.Items.map(
                function (item) {
                    return item.Id as string;
                }
            )
        };
    }
}