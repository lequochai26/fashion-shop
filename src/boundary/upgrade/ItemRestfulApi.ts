import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import Item from "../../domain/entities/upgrade/Item";
import DomainManager from "../../domain/upgrade/DomainManager";
import AsyncConverter from "../../utils/interfaces/AsyncConverter";
import RestfulApi from "../base_classes/upgrade/RestfulApi";
import Controller from "../controllers/interfaces/Controller";
import RestfulControllerParam from "../controllers/interfaces/RestfulControllerParam";
import GetAllItemsController from "../controllers/upgrade/GetAllItemsController";
import GetItemController from "../controllers/upgrade/GetItemController";
import GetItemsByFilterController from "../controllers/upgrade/GetItemsByFilterController";
import GetItemsByKeywordController from "../controllers/upgrade/GetItemsByKeywordController";
import RemoveItemController from "../controllers/upgrade/RemoveItemController";
import UpdateItemController from "../controllers/upgrade/UpdateItemController";
import UpgradedNewItemController from "../controllers/upgrade/UpgradedNewItemController";
import ItemInfoConverter from "../converters/upgrade/ItemInfoConverter";
import ItemInfo from "../infos/item/ItemInfo";

export default class ItemRestfulApi extends RestfulApi {
    // Static fields:
    private static path: string = "/item";

    // Fields:
    private itemInfoConverter: AsyncConverter<Item, ItemInfo>;
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