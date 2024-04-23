import Brand from "../../../../domain/entities/upgrade/Brand";
import DomainManager from "../../../../domain/upgrade/DomainManager";
import AsyncConverter from "../../../../utils/interfaces/AsyncConverter";
import BrandInfo from "../../../infos/brand/BrandInfo";
import RestfulController from "./RestfulController";

export default abstract class QueryBrandRestfulController extends RestfulController {
    // Fields:
    protected brandInfoConverter: AsyncConverter<Brand, BrandInfo>;

    // Constructors:
    public constructor(
        brandInfoConverter: AsyncConverter<Brand, BrandInfo>,
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);

        this.brandInfoConverter = brandInfoConverter;
    }
}