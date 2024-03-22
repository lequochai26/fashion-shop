import DomainManager from "../../../domain/DomainManager";
import Brand from "../../../domain/entities/Brand";
import Converter from "../../../utils/interfaces/Converter";
import BrandInfo from "../../infos/brand/BrandInfo";
import RestfulController from "./RestfulController";

export default abstract class BrandQueryRestfulController extends RestfulController {
    // Fields:
    protected brandInfoConverter: Converter<Brand, BrandInfo>;

    // Constructors:
    public constructor(
        brandInfoConverter: Converter<Brand, BrandInfo>,
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);

        this.brandInfoConverter = brandInfoConverter;
    }
}