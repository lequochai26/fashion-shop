import Brand from "../../../domain/entities/upgrade/Brand";
import DomainManager from "../../../domain/upgrade/DomainManager";
import AsyncConverter from "../../../utils/interfaces/AsyncConverter";
import Converter from "../../../utils/interfaces/Converter";
import BrandInfo from "../../infos/brand/BrandInfo";
import QueryBrandRestfulController from "../abstracts/upgrade/QueryBrandRestfulController";
import RestfulControllerParam from "../interfaces/RestfulControllerParam";

export default class GetAllBrandsController extends QueryBrandRestfulController{
    //Constructor
    public constructor(
        brandInfoConverter: AsyncConverter<Brand, BrandInfo>,
        domainManager?: DomainManager | undefined
    ){
        super(brandInfoConverter,domainManager);
    }
    
    
    //Methods
    public async execute({ response }: RestfulControllerParam): Promise<void> {
        //khai báo biến self tham chiếu GetAllItemController 
        const self: GetAllBrandsController = this;

        //path
        const path: any[] = [];

        //lấy danh sách thương hiệu 
        try{
            var brands: Brand[] = await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.getAllBrands(path);
                }
            )
        }catch(error){
            console.error(error);

            response.json({
                success: false,
                message: "Failed while handling with DB!",
                code: "HANDLING_DB_FAILED"
            });
            return;
        }

        const result: BrandInfo[] = [];
        for (const brand of brands) {
            result.push(await self.brandInfoConverter.convert(brand));
        }

        // trả danh sách về cho người dùng khách hàng
        response.json({
            success: true,
            /*Một trường chứa dữ liệu kết quả của yêu cầu. Trong trường này, map() lặp 
            mỗi phần tử trong mảng brands,sử dụng brandInfoConverter.convert() chuyển đổi brand thành một đối tượng mới.*/
            result
        })
    } 

}





