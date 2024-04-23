import Brand from "../../../domain/entities/upgrade/Brand";
import DomainManager from "../../../domain/upgrade/DomainManager";
import RestfulError from "../../errors/RestfulError";
import PermissionRequiredRestfulController from "../abstracts/upgrade/PermissionRequiredRestfulController";
import RestfulControllerParam from "../interfaces/RestfulControllerParam";

export default class NewBrandController extends PermissionRequiredRestfulController {
    //Constructor
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
            if(error instanceof RestfulError) {
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
        
        //Get id from body 
        const id: string | undefined = request.body.id as string;

        if (!id) {
            response.json(
                {
                    success: false,
                    message: "id parameter is required!",
                    code: "ID_REQUIRED"
                }
            );
            return;
        }

        //Get name from body
        const name: string | undefined = request.body.name;

        if (!name) {
            response.json(
                {
                    success: false,
                    message: "name parameter is required!",
                    code: "NAME_REQUIRED"
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
                    message: "Failed while handing with DB!",
                    code: "HANDLING_DB_FAILED"
                }
            );

            return;
        }

        if (brand) {
            response.json(
                {
                    success: false,
                    message: "Brand with given id already exist!",
                    code: "BRAND_ALREADY_EXIST"
                }
            );

            return;
        }

        //Inserting brand
        brand = new Brand();
        brand.Id = id;
        brand.Name = name;

        try {
            await this.useDomainManager(
                async function(domainManager) {
                    return domainManager.insertBrand(brand as Brand);
                }
            )
        } catch (error) {
            console.error(error);

            response.json(
                {
                    success: false,
                    message: "Failed while handling with DB!",
                    code: "FAILED_HANDLING_DB"
                }
            )

            return;
        }

        //Successful responding
        response.json(
            { success: true }
        );
    }
}