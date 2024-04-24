import { Request, Response } from "express";
import Brand from "../../domain/entities/upgrade/Brand";
import DomainManager from "../../domain/upgrade/DomainManager";
import AsyncConverter from "../../utils/interfaces/AsyncConverter";
import RestfulApi from "../base_classes/upgrade/RestfulApi";
import Controller from "../controllers/interfaces/Controller";
import RestfulControllerParam from "../controllers/interfaces/RestfulControllerParam";
import GetAllBrandsController from "../controllers/upgrade/GetAllBrandsController";
import GetBrandController from "../controllers/upgrade/GetBrandController";
import GetBrandsByKeyWordController from "../controllers/upgrade/GetBrandsByKeyWordController";
import NewBrandController from "../controllers/upgrade/NewBrandController";
import RemoveBrandController from "../controllers/upgrade/RemoveBrandController";
import UpdateBrandController from "../controllers/upgrade/UpdateBrandController";
import BrandInfoConverter from "../converters/upgrade/BrandInfoConverter";
import BrandInfo from "../infos/brand/BrandInfo";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

export default class BrandRestfulApi extends RestfulApi {
    // Static fields:
    private static path: string = "/brand";

    // Fields:
    private brandInfoConverter: AsyncConverter<Brand, BrandInfo>;
    private newBrandController: Controller<RestfulControllerParam, void>;
    private updateBrandController: Controller<RestfulControllerParam, void>;
    private removeBrandController: Controller<RestfulControllerParam, void>;
    private getAllBrandsController: Controller<RestfulControllerParam, void>;
    private getBrandController: Controller<RestfulControllerParam, void>;
    private getBrandsByKeywordController: Controller<RestfulControllerParam, void>;

    // Constructors:
    public constructor(domainManager?: DomainManager | undefined) {
        super(BrandRestfulApi.path, domainManager);

        this.brandInfoConverter = new BrandInfoConverter();
        
        this.newBrandController = new NewBrandController(this.domainManager);

        this.updateBrandController = new UpdateBrandController(this.domainManager);

        this.removeBrandController = new RemoveBrandController(this.domainManager);

        this.getAllBrandsController = new GetAllBrandsController(this.brandInfoConverter, this.domainManager);

        this.getBrandController = new GetBrandController(this.brandInfoConverter, this.domainManager);
        
        //'3'/
        this.getBrandsByKeywordController = new GetBrandsByKeyWordController(this.brandInfoConverter,this.domainManager);
    }

    // Methods:
    public async get(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>): Promise<void> {
        // Get method from request
        const method: string | undefined = request.query.method as string | undefined;

        // Controller declaration
        let controller: Controller<RestfulControllerParam, void>;

        // Switch methdos
        switch (method) {
            case 'getAll': {
                controller = this.getAllBrandsController;
                break;
            }

            case 'get': {
                controller = this.getBrandController;
                break;
            }

            case 'getByKeyword': {
                controller = this.getBrandsByKeywordController;
                break;
            }

            default: controller = this.invalidMethodController;
        }

        // Execute controller
        return controller.execute(
            { request: request, response: response }
        );
    }

    public async post(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>): Promise<void> {
        return this.newBrandController.execute(
            { request: request, response: response }
        );
    }

    public async put(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>): Promise<void> {
        return this.updateBrandController.execute(
            { request: request, response: response }
        );
    }

    public async delete(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>): Promise<void> {
        return this.removeBrandController.execute(
            { request: request, response: response }
        );
    }
}