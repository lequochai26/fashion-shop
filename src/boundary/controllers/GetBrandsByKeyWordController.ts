import DomainManager from "../../domain/DomainManager";
import Brand from "../../domain/entities/Brand";
import Converter from "../../utils/interfaces/Converter";
import BrandInfo from "../infos/brand/BrandInfo";
import BrandQueryRestfulController from "./abstracts/BrandQueryRestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";

export default class GetBrandsByKeyWordController extends BrandQueryRestfulController{
    //constructor
    public constructor(
        brandInfoConverter : Converter<Brand,BrandInfo>,
        domainManager?: DomainManager | undefined
    ){
        super(brandInfoConverter,domainManager);
    }

    //method
    //External App gửi yêu cầu truy vấn danh sách sản phẩm theo từ khóa kèm theo từ khóa truy vấn đến hệ thống.
    public async execute( {request,response}: RestfulControllerParam): Promise<void> {
       //Hệ thống kiểm tra và xác nhận External App đã cung cấp từ khóa truy vấn.
        const keyword : string | undefined = request.query.keyword as string;
        if(!keyword){
            response.json(
                {
                    success : false,
                    message : "keyword parameter is required!",
                    code : "KEYWORD_REQURIED"
                }
            );
            return;
        }
        
        const seft : GetBrandsByKeyWordController = this;
        //Cơ sở dữ liệu truy vấn danh sách thương hiệu theo yêu cầu và phản hồi kết quả truy vấn cho hệ thống.
        try {
            var brand : Brand[] = await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.searchBrands(keyword);
                }
            )
        } catch (error) {
            console.error(error);

            response.json(
                {
                    success : false,
                    message :"Failed while handling with DB",
                    code :"HANDLING_DB_FAILED"
                }
            );
            return;
        }

        //Hệ thống phản hồi về External App với trạng thái thành công kèm theo kết quả truy vấn.
        response.json(
            {
                success : true,
                result : brand.map(
                    function(brand: Brand):BrandInfo{
                        return seft.brandInfoConverter.convert(brand);
                    }
                )
            }
        );
    }
}