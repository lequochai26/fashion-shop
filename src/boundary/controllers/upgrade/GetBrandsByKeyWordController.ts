import Brand from "../../../domain/entities/upgrade/Brand";
import DomainManager from "../../../domain/upgrade/DomainManager";
import AsyncConverter from "../../../utils/interfaces/AsyncConverter";
import BrandInfo from "../../infos/brand/BrandInfo";
import QueryBrandRestfulController from "../abstracts/upgrade/QueryBrandRestfulController";
import RestfulControllerParam from "../interfaces/RestfulControllerParam";

export default class GetBrandsByKeyWordController extends QueryBrandRestfulController{
    //constructor
    public constructor(
        brandInfoConverter : AsyncConverter<Brand,BrandInfo>,
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
        
        const self : GetBrandsByKeyWordController = this;
        //Cơ sở dữ liệu truy vấn danh sách thương hiệu theo yêu cầu và phản hồi kết quả truy vấn cho hệ thống.
        try {
            var brands : Brand[] = await this.useDomainManager(
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

        const result: BrandInfo[] = [];
        for (const brand of brands) {
            result.push(await this.brandInfoConverter.convert(brand));
        }

        //Hệ thống phản hồi về External App với trạng thái thành công kèm theo kết quả truy vấn.
        response.json(
            {
                success : true,
                result
            }
        );
    }
}
