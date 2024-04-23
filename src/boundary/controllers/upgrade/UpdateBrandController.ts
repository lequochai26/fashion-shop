import Brand from "../../../domain/entities/upgrade/Brand";
import DomainManager from "../../../domain/upgrade/DomainManager";
import RestfulError from "../../errors/RestfulError";
import PermissionRequiredRestfulController from "../abstracts/upgrade/PermissionRequiredRestfulController";
import RestfulControllerParam from "../interfaces/RestfulControllerParam";

export default class UpdateBrandController extends PermissionRequiredRestfulController {
    //Constructor:
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);
    }

    //Method:
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
        const id: string | undefined = request.body.id as string;

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


        //Check id
        let brand: Brand | undefined;
        try {
            brand = await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.getBrand(id, path);
                }
            )
        } catch (error: any) {
            console.error(error);

            response.json(
                {
                    success: false,
                    message: "Failed while handling with DB!",
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

        //Get name 
        const name: string | undefined = request.body.name;

        if (name) {
            brand.Name = name;
        }

        //Update to DB
        try {
            await this.useDomainManager(
                async function (domainManager) {
                    return domainManager.updateBrand(brand as Brand);
                }
            )
        } catch (error: any) {
            console.error(error);

            response.json(
                {
                    success: false,
                    message: "Failed while handling with DB!",
                    code: "FAILED_WITH_DB"
                }
            );

            return;
        }

        //Responding to client
        response.json({ success: true })
    }
}