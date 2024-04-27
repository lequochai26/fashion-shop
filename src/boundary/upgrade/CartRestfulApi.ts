import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import CartItem from "../../domain/entities/upgrade/CartItem";
import DomainManager from "../../domain/upgrade/DomainManager";
import AsyncConverter from "../../utils/interfaces/AsyncConverter";
import RestfulApi from "../base_classes/upgrade/RestfulApi";
import Controller from "../controllers/interfaces/Controller";
import RestfulControllerParam from "../controllers/interfaces/RestfulControllerParam";
import AddCartItemController from "../controllers/upgrade/AddCartItemController";
import GetCartController from "../controllers/upgrade/GetCartController";
import RemoveCartItemController from "../controllers/upgrade/RemoveCartIttemController";
import CartItemInfoConverter from "../converters/upgrade/CartItemInfoConverter";
import CartItemInfo from "../infos/cartitem/CartItemInfo";
import UpgradedGetCartController from "../controllers/upgrade/UpgradedGetCartController";
import AttachCartItemController from "../controllers/upgrade/AttachCartItemController";

export default class CartRestfulApi extends RestfulApi {
    // Static fields:
    private static path: string = "/cart";

    // Fields:
    private cartItemInfoConverter: AsyncConverter<CartItem, CartItemInfo>;
    private addCartItemController: Controller<RestfulControllerParam, void>;
    private attachCartItemController: Controller<RestfulControllerParam, void>;
    private removeCartItemController: Controller<RestfulControllerParam, void>;
    private getCartController: Controller<RestfulControllerParam, void>;

    // Constructors:
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(
            CartRestfulApi.path,
            domainManager
        );

        this.cartItemInfoConverter = new CartItemInfoConverter();

        this.addCartItemController = new AddCartItemController(this.domainManager);
        this.attachCartItemController = new AttachCartItemController(this.domainManager);
        this.removeCartItemController = new RemoveCartItemController(domainManager);
        this.getCartController = new UpgradedGetCartController(this.cartItemInfoConverter, this.domainManager);
    }

    // Methods:
    public async get(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>): Promise<void> {
        return this.getCartController.execute({ request, response });
    }

    public async post(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>): Promise<void> {
        const method: string | undefined = request.query.method as string | undefined;

        let controller: Controller<RestfulControllerParam, void>;
        switch (method) {
            case 'add': {
                controller = this.addCartItemController;
                break;
            }

            case 'attach': {
                controller = this.attachCartItemController;
                break;
            }

            default: {
                controller = this.invalidMethodController
            }
        }

        return controller.execute({ request, response });
    }

    public async put(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>): Promise<void> {
        return this.removeCartItemController.execute({ request, response });
    }
}