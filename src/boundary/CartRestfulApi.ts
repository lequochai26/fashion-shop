import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import DomainManager from "../domain/DomainManager";
import CartItem from "../domain/entities/CartItem";
import Converter from "../utils/interfaces/Converter";
import RestfulApi from "./base_classes/RestfulApi";
import Controller from "./controllers/interfaces/Controller";
import RestfulControllerParam from "./controllers/interfaces/RestfulControllerParam";
import CartItemInfoConverter from "./converters/CartItemInfoConverter";
import CartItemInfo from "./infos/cartitem/CartItemInfo";

export default class CartRestfulApi extends RestfulApi {
    // Static fields:
    private static path: string = "/cart";

    // Fields:
    private cartItemInfoConverter: Converter<CartItem, CartItemInfo>;
    private addCartItemController: Controller<RestfulControllerParam, void>;
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

        this.addCartItemController = this.methodUnimplementedController;
        this.removeCartItemController = this.methodUnimplementedController;
        this.getCartController = this.methodUnimplementedController;
    }

    // Methods:
    public async get(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>): Promise<void> {
        return this.getCartController.execute({ request, response });
    }

    public async post(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>): Promise<void> {
        return this.addCartItemController.execute({ request, response });
    }

    public async delete(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>): Promise<void> {
        return this.removeCartItemController.execute({ request, response });
    }
}