import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import DomainManager from "../domain/DomainManager";
import RestfulApi from "./base_classes/RestfulApi";
import Controller from "./controllers/interfaces/Controller";
import GetAllItemsController from "./controllers/GetAllItemsController";
import RestfulControllerParam from "./controllers/interfaces/RestfulControllerParam";
import Item from "../domain/entities/Item";
import ItemInfo from "./infos/item/ItemInfo";
import ItemInfoConverter from "./converters/ItemInfoConverter";
import ReversableConverter from "../utils/interfaces/ReversableConverter";
import UpdateItemController from "./controllers/UpdateItemController";
import RemoveItemController from "./controllers/RemoveItemController";
import GetItemController from "./controllers/GetItemController";
import UpgradedNewItemController from "./controllers/UpgradedNewItemController";
import GetItemsByKeywordController from "./controllers/GetItemsByKeywordController";
import GetItemsByFilterController from "./controllers/GetItemsByFilterController";

export default class ItemRestfulApi extends RestfulApi {
    // Static fields:
    private static path: string = "/item";

    // Fields:
    private itemInfoConverter: ReversableConverter<Item, ItemInfo>;
    private getAllItemsController: Controller<RestfulControllerParam, void>;
    private newItemController: Controller<RestfulControllerParam, void>;
    private getItemsByFilterController: Controller<RestfulControllerParam, void>;
    private getItemController: Controller<RestfulControllerParam, void>;
    private getItemsByKeywordController: Controller<RestfulControllerParam, void>;
    private updateItemController: Controller<RestfulControllerParam, void>;
    private removeItemController: Controller<RestfulControllerParam, void>;

    // Constructor:
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(
            ItemRestfulApi.path,
            domainManager
        );

        this.itemInfoConverter = new ItemInfoConverter();

        this.getAllItemsController = new GetAllItemsController(
            this.itemInfoConverter,
            this.domainManager
        );

        this.newItemController = new UpgradedNewItemController(
            this.domainManager
        );

        this.getItemsByFilterController = new GetItemsByFilterController(
            this.itemInfoConverter,
            this.domainManager
        );

        this.getItemController = new GetItemController(
            this.itemInfoConverter, this.domainManager
        );

        this.getItemsByKeywordController = new GetItemsByKeywordController(this.itemInfoConverter,this.domainManager);

        this.updateItemController = new UpdateItemController(this.domainManager);

        this.removeItemController = new RemoveItemController(this.domainManager);
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

    public async post(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>): Promise<void> {
        return this.newItemController.execute(
            { request: request, response: response }
        );
    }

    public async put(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>): Promise<void> {
        return this.updateItemController.execute(
            { request: request, response: response }
        );
    }

    public async delete(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>): Promise<void> {
        return this.removeItemController.execute(
            { request: request, response: response }
        );
    }
}