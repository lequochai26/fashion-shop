import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import DomainManager from "../domain/DomainManager";
import RestfulApi from "./base_classes/RestfulApi";
import Controller from "./controllers/interfaces/Controller";
import RestfulControllerParam from "./controllers/interfaces/RestfulControllerParam";
import UpdateItemTypeController from "./controllers/UpdateItemTypeController";
import GetAllItemTypesController from "./controllers/GetAllItemTypesController";
import ItemTypeInfo from "./infos/itemtype/ItemTypeInfo";
import ItemType from "../domain/entities/ItemType";
import ItemTypeInfoConverter from "./converters/ItemTypeInfoConverter";
import Converter from "../utils/interfaces/Converter";
import NewItemTypeController from "./controllers/NewItemTypeController";

export default class ItemTypeRestfulApi extends RestfulApi {
    // Static fields:
    private static path: string = "/itemType";

    // Fields:
    private itemTypeInfoConverter: Converter<ItemType,ItemTypeInfo>;
    private newItemTypeController: Controller<RestfulControllerParam, void>;
    private updateItemTypeController: Controller<RestfulControllerParam, void>;
    private removeItemTypeController: Controller<RestfulControllerParam, void>;
    private getAllItemTypesController: Controller<RestfulControllerParam, void>;
    private getItemTypeController: Controller<RestfulControllerParam, void>;
    private getItemTypesByKeywordController: Controller<RestfulControllerParam, void>;

    // Constructors:
    public constructor(domainManager?: DomainManager | undefined) {
        super(ItemTypeRestfulApi.path, domainManager);

        this.itemTypeInfoConverter = new ItemTypeInfoConverter();
        this.newItemTypeController = new NewItemTypeController(this.domainManager); 
        this.updateItemTypeController = new UpdateItemTypeController(this.domainManager);
        this.removeItemTypeController = this.methodUnimplementedController;
        this.getAllItemTypesController = new GetAllItemTypesController(this.itemTypeInfoConverter, this.domainManager)
        this.getItemTypeController = this.methodUnimplementedController;
        this.getItemTypesByKeywordController = this.methodUnimplementedController;
    }

    // Methods:
    public async get(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>): Promise<void> {
        // Get method
        const method: string | undefined = request.query.method as string | undefined;

        // Get controller
        let controller: Controller<RestfulControllerParam, void>;
        switch (method) {
            case 'getAll': {
                controller = this.getAllItemTypesController;
                break;
            }

            case 'get': {
                controller = this.getItemTypeController;
                break;
            }

            case 'getByKeyword': {
                controller = this.getItemTypesByKeywordController;
                break;
            }

            default: {
                controller = this.invalidMethodController;
            }
        }

        // Execute controller
        return controller.execute({ request: request, response: response });
    }

    public async post(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>): Promise<void> {
        return this.newItemTypeController.execute({ request: request, response: response });
    }

    public async put(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>): Promise<void> {
        return this.updateItemTypeController.execute({ request: request, response: response });
    }

    public async delete(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>): Promise<void> {
        return this.removeItemTypeController.execute({ request: request, response: response });
    }
}