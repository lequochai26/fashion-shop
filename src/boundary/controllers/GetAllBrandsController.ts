import DomainManager from "../../domain/DomainManager";
import Brand from "../../domain/entities/Brand";
import ReversableConverter from "../../utils/interfaces/ReversableConverter";
import BrandInfo from "../infos/brand/BrandInfo";
import BrandQueryRestfulController from "./abstracts/BrandQueryRestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";
import { response } from "express";


export default class GetAllBrandsController extends BrandQueryRestfulController{
    //Constructor
    public constructor(
        brandInfoConverter: ReversableConverter<Brand, BrandInfo>,
        domainManager?: DomainManager | undefined
    ){
        super(brandInfoConverter,domainManager);
    }
    
    
    //Methods
    public async execute(param: RestfulControllerParam): Promise<void> {
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

        // trả danh sách về cho người dùng khách hàng
        response.json({
            success: true,
            /*Một trường chứa dữ liệu kết quả của yêu cầu. Trong trường này, chúng ta có thể thấy một cuộc gọi map() 
            để chuyển đổi mỗi phần tử trong mảng items thành một đối tượng mới, sử dụng itemInfoConverter.convert(item).*/
            result: brands.map(function(brand: Brand): BrandInfo{
                return self.brandInfoConverter.convert(brand);
            })
        })
    }
    
}





