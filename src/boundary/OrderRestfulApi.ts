import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import DomainManager from "../domain/DomainManager";
import Order from "../domain/entities/Order";
import Converter from "../utils/interfaces/Converter";
import RestfulApi from "./base_classes/RestfulApi"
import Controller from "./controllers/interfaces/Controller";
import RestfulControllerParam from "./controllers/interfaces/RestfulControllerParam";
import OrderInfoConverter from "./converters/OrderInfoConverter";
import OrderInfo from "./infos/order/OrderInfo";
import OptimizedNewOrderController from "./controllers/OptimizedNewOrderController";

export default class OrderRestfulApi extends RestfulApi {
    // Static fields:
    private static path: string = "/order";

    // Fields:
    private orderInfoConverter: Converter<Order, OrderInfo>;
    private newOrderController: Controller<RestfulControllerParam, void>;
    private createOrderController: Controller<RestfulControllerParam, void>;
    private updateOrderStatusController: Controller<RestfulControllerParam, void>;
    private removeOrderController: Controller<RestfulControllerParam, void>;
    private cancelOrderController: Controller<RestfulControllerParam, void>;
    private statisticalController: Controller<RestfulControllerParam, void>;
    private getAllOrdersController: Controller<RestfulControllerParam, void>;
    private getOrdersByKeywordController: Controller<RestfulControllerParam, void>;
    private getOrderController: Controller<RestfulControllerParam, void>;

    // Constructors:
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(
            OrderRestfulApi.path,
            domainManager
        );

        this.orderInfoConverter = new OrderInfoConverter();

        // this.newOrderController = new NewOrderController(this.domainManager);
        this.newOrderController = new OptimizedNewOrderController(this.domainManager);
        this.createOrderController = this.methodUnimplementedController;
        this.updateOrderStatusController = this.methodUnimplementedController;
        this.removeOrderController = this.methodUnimplementedController;
        this.cancelOrderController = this.methodUnimplementedController;
        this.statisticalController = this.methodUnimplementedController;
        this.getAllOrdersController = this.methodUnimplementedController;
        this.getOrdersByKeywordController = this.methodUnimplementedController;
        this.getOrderController = this.methodUnimplementedController;
    }

    // Methods:
    public async get(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>): Promise<void> {
        // Get method from request's query
        const method: string | undefined = request.query.method as string | undefined

        // Get controller
        let controller: Controller<RestfulControllerParam, void>;

        switch (method) {
            case 'getAll': {
                controller = this.getAllOrdersController;
                break;
            }

            case 'getByKeyword': {
                controller = this.getOrdersByKeywordController;
                break;
            }

            case 'get': {
                controller = this.getOrderController;
                break;
            }

            case 'statistical': {
                controller = this.statisticalController;
                break;
            }

            default: {
                controller = this.invalidMethodController;
            }
        }

        // Execute controller
        return controller.execute({ request, response });
    }

    public async post(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>): Promise<void> {
        // Get method from request's query
        const method: string | undefined = request.query.method as string | undefined;

        // Get controller
        let controller: Controller<RestfulControllerParam, void>;

        switch (method) {
            case 'new': {
                controller = this.newOrderController;
                break;
            }

            case 'create': {
                controller = this.createOrderController;
                break;
            }

            default: {
                controller = this.invalidMethodController;
            }
        }

        // Execute controller
        return controller.execute({ request, response });
    }

    public async put(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>): Promise<void> {
        // Get method
        const method: string | undefined = request.query.method as string | undefined;

        // Get controller
        let controller: Controller<RestfulControllerParam, void>;

        switch (method) {
            case 'updateStatus': {
                controller = this.updateOrderStatusController;
                break;
            }

            case 'cancel': {
                controller = this.cancelOrderController;
                break;
            }

            default: {
                controller = this.invalidMethodController;
            }
        }

        // Execute controller
        return controller.execute({ request, response });
    }

    public async delete(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>): Promise<void> {
        return this.removeOrderController.execute({ request, response });
    }
}