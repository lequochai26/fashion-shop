import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import DomainManager from "../domain/DomainManager";
import RestfulApi from "./base_classes/RestfulApi";
import Controller from "./controllers/interfaces/Controller";
import GetAllItemsController from "./controllers/GetAllItemsController";
import RestfulControllerParam from "./controllers/interfaces/RestfulControllerParam";

export default class ItemRestfulApi extends RestfulApi {
    // Static fields:
    private static path: string = "/item";

    // Fields:
    private getAllItemsController: Controller<RestfulControllerParam, void>;
    private newItemController: Controller<RestfulControllerParam, void>;
    private getItemsByFilterController: Controller<RestfulControllerParam, void>;
    private getItemController: Controller<RestfulControllerParam, void>;
    private getItemsByKeywordController: Controller<RestfulControllerParam, void>;
    private updateItemController: Controller<RestfulControllerParam, void>;
    private removeItemController: Controller<RestfulControllerParam, void>;

    // Constructor:
    public constructor(
        domainManager?: DomainManager | undefined,
        getAllItemsController?: Controller<RestfulControllerParam, void>,
        newItemController?: Controller<RestfulControllerParam, void>,
        getItemsByFilterController?: Controller<RestfulControllerParam, void>,
        getItemController?: Controller<RestfulControllerParam, void>,
        getItemsByKeywordController?: Controller<RestfulControllerParam, void>,
        updateItemController?: Controller<RestfulControllerParam, void>,
        removeItemController?: Controller<RestfulControllerParam, void>,
    ) {
        super(
            ItemRestfulApi.path,
            domainManager
        );

        this.getAllItemsController = getAllItemsController || new GetAllItemsController(this.domainManager);

        this.newItemController = newItemController || this.methodUnimplementedController;

        this.getItemsByFilterController = getItemsByFilterController || this.methodUnimplementedController;

        this.getItemController = getItemController || this.methodUnimplementedController;

        this.getItemsByKeywordController = getItemsByKeywordController || this.methodUnimplementedController;

        this.updateItemController = updateItemController || this.methodUnimplementedController;

        this.removeItemController = removeItemController || this.methodUnimplementedController;
    }

    // Methods:
    public async get(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>): Promise<void> {
        // Get method query
        const method: string | undefined = request.query.method as (string | undefined);

        // Controller declaration
        let controller: Controller<RestfulControllerParam, void>;

        // Switch method
        switch (method) {
            case 'getAll': {
                controller = this.getAllItemsController;
                break;
            }

            case 'new': {
                controller = this.newItemController;
                break;
            }

            case 'getByFilter': {
                controller = this.getItemsByFilterController;
                break;
            }

            case 'get': {
                controller = this.getItemController;
                break;
            }

            case 'getByKeyword': {
                controller = this.getItemsByKeywordController;
                break;
            }

            case 'update': {
                controller = this.updateItemController;
                break;
            }

            case 'remove': {
                controller = this.removeItemController;
                break;
            }

            default: {
                controller = this.invalidMethodController;
                break;
            }
        }

        // Execute controller
        return controller.execute(
            { request: request, response: response }
        );
    }
}