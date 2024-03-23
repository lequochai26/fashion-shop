import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import DomainManager from "../domain/DomainManager";
import Brand from "../domain/entities/Brand";
import Converter from "../utils/interfaces/Converter";
import RestfulApi from "./base_classes/RestfulApi";
import Controller from "./controllers/interfaces/Controller";
import RestfulControllerParam from "./controllers/interfaces/RestfulControllerParam";
import BrandInfoConverter from "./converters/BrandInfoConverter";
import BrandInfo from "./infos/brand/BrandInfo";
import GetBrandController from "./controllers/GetBrandController";
import GetBrandsByKeyWordController from "./controllers/GetBrandsByKeyWordController";

export default class BrandRestfulApi extends RestfulApi {
    // Static fields:
    private static path: string = "/brand";

    // Fields:
    private brandInfoConverter: Converter<Brand, BrandInfo>;
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
        
        this.newBrandController = this.methodUnimplementedController;

        this.updateBrandController = this.methodUnimplementedController;

        this.removeBrandController = this.methodUnimplementedController;

        this.getAllBrandsController = this.methodUnimplementedController;

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