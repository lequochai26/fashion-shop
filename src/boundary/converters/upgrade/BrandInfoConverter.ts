import Brand from "../../../domain/entities/upgrade/Brand";
import AsyncConverter from "../../../utils/interfaces/AsyncConverter";
import BrandInfo from "../../infos/brand/BrandInfo";

export default class BrandInfoConverter implements AsyncConverter<Brand, BrandInfo> {
    // Constructors:
    public constructor() {

    }

    // Methods:
    public async convert(from: Brand): Promise<BrandInfo> {
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