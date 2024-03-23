import DomainManager from "../../domain/DomainManager";
import Brand from "../../domain/entities/Brand";
import RestfulController from "./abstracts/RestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";

export default class UpdateBrandController extends RestfulController {
    //Constructor:
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);
    }

    //Method:
    public async execute( { request, response }: RestfulControllerParam): Promise<void> {
        //Get id
        const id: string | undefined = request.body.id as string;

        if(!id) {
            response.json(
                {
                    success: false,
                    message: "id parameter is requied!",
                    code: "ID_REQUIED"
                }
            );

            return;
        }

        //Path initialazation
        const path: any[] = [];

        //Check id
        let brand: Brand | undefined;
        try {
            brand = await this.useDomainManager(
                async function(domainManager) {
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

        if(name) {
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