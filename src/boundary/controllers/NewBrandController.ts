import DomainManager from "../../domain/DomainManager";
import Brand from "../../domain/entities/Brand";
import RestfulController from "./abstracts/RestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";

export default class NewBrandController extends RestfulController {
    //Constructor
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);
    }

    //Method:
    public async execute({ request, response }: RestfulControllerParam): Promise<void> {
        //Get id from body 
        const id: string | undefined = request.body.id as string;

        if (!id) {
            response.json(
                {
                    success: false,
                    message: "id parameter is requied!",
                    code: "ID_REQUIED"
                }
            );
        }

        //Get name from body
        const name: string | undefined = request.body.name;

        if (!name) {
            response.json(
                {
                    success: false,
                    message: "name parameter is requied!",
                    code: "NAME_REQUIED"
                }
            );

            return;
        }

        //Path initialazation
        const path: any[] = []

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
        )
    }
}