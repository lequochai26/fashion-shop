import DomainManager from "../../domain/DomainManager";
import Brand from "../../domain/entities/Brand";
import RestfulError from "../errors/RestfulError";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";
import PermissionRequiredRestfulController from "./abstracts/PermissionRequiredRestfulController";

export default class RemoveBrandController extends PermissionRequiredRestfulController {
    //Constructor:
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager)
    }

    //method:
    public async execute({ request, response }: RestfulControllerParam): Promise<void> {
        //Path initialazation
        const path: any[] = [];

        //Validate
        try {
            await this.managerValidateController.execute({ request, path });
        } catch (error: any) {
            if (error instanceof RestfulError) {
                response.json(
                    {
                        success: false,
                        message: error.message,
                        code: error.Code
                    }
                );

                return;
            } else {
                response.json(
                    {
                        success: false,
                        message: "Failed while handling with DB!",
                        code: "HANDLING_DB_FAILED"
                    }
                );

                return;
            }
        }

        //Get id
        const id: string | undefined = request.query.id as string;

        if (!id) {
            response.json(
                {
                    success: false,
                    message: "id parameter is requied!",
                    code: "ID_REQUIED"
                }
            );

            return;
        }

        //Get brand
        let brand: Brand | undefined;
        try {
            brand = await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.getBrand(id, path);
                }
            )
        } catch (error: any) {
            response.json(
                {
                    success: false,
                    message: "Failed while handing with DB!",
                    code: "FAILED_HANDLING_DB"
                }
            );

            return;
        }

        if (!brand) {
            response.json(
                {
                    success: false,
                    message: "Brand with given id doesn't exist!",
                    code: "BRAND_NOT_EXIST"
                }
            );

            return;
        }

        //Item dependency
        if (brand.Items.length > 0) {
            response.json(
                {
                    success: false,
                    message: "Please, make sure there's no item linked to this Brand before performing this action!",
                    code: "ITEM_LINKED"
                }
            );

            return;
        }

        //Delete brand
        try {
            await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.removeBrand(brand as Brand);
                }
            )
        } catch (error: any) {
            console.error(error);

            response.json(
                {
                    success: false,
                    message: "Failed while handling with DB!",
                    code: "FAILED_HANDING_DB"
                }
            );

            return;
        }

        //Responding to client
        response.json({ success: true });
    }
}