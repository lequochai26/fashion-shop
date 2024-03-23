import DomainManager from "../../domain/DomainManager";
import Brand from "../../domain/entities/Brand";
import Converter from "../../utils/interfaces/Converter";
import BrandInfo from "../infos/brand/BrandInfo";
import BrandQueryRestfulController from "./abstracts/BrandQueryRestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";

export default class GetBrandController extends BrandQueryRestfulController {

    //Constructor
    public constructor(
        brandInfoConverter: Converter<Brand, BrandInfo>,
        domainManager?: DomainManager | undefined
    ) {
        super(brandInfoConverter, domainManager)
    }


    //Methods

    //External App gửi yêu cầu truy vấn thương hiệu đến hệ thông kèm theo mã thương hiệu.
    public async execute({ response, request }: RestfulControllerParam): Promise<void> {

        /*Hệ thống kiểm tra và xác nhận External App đã cung cấp mã thương hiệu.*/
        const id: string | undefined = request.query.id as string;

        /*Hệ thống kiểm tra và nhận thấy External App chưa cung cấp mã thương hiệu.*/
        if (!id) {
            /*Hệ thống phản hồi về External App với trạng thái thất bại
             kèm theo dòng thông điệp: "id parameter is required!" và mã phản hồi: "ID_REQUIRED".*/
            response.json(
                {
                    success: false,
                    message: "id parameter is required!",
                    code: "ID_REQUIRED"
                }

            );
        }

        //Tạo đường dẫn
        const path: any = [] = [];

        /*Cơ sở dữ liệu truy vấn thương hiệu theo
         yêu cầu và phản hồi kết quả truy vấn cho hệ thống.*/

         try {
            var brand: Brand | undefined =
                await this.useDomainManager( //This = Su dung useDomainManager trong GetItem
                    async function (useDomainManager) {
                        return useDomainManager.getBrand(id, path)
                    }
                )
        } catch (error: any) {
            console.log(error);

            //Trong luong catch
            response.json(
                {
                    success: false,
                    message: "Failed while handling with DB!"
                }
            )
            return;
        }
        response.json(
            {
                success: true,
                result: brand && this.brandInfoConverter.convert(brand)
            }
        )
    }
}