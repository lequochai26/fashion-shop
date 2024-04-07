import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import DomainManager from "../domain/DomainManager";
import User from "../domain/entities/User";
import Converter from "../utils/interfaces/Converter";
import RestfulApi from "./base_classes/RestfulApi";
import Controller from "./controllers/interfaces/Controller";
import RestfulControllerParam from "./controllers/interfaces/RestfulControllerParam";
import UserInfoConverter from "./converters/UserInfoConverter";
import UserInfo from "./infos/user/UserInfo";

export default class UserRestfulApi extends RestfulApi {
    // Static fields:
    private static path: string = "/user";

    // Fields:
    private userInfoConverter: Converter<User, UserInfo>;
    private getUsersByKeywordController: Controller<RestfulControllerParam, void>;
    private getAllUsersController: Controller<RestfulControllerParam, void>;
    private getUserController: Controller<RestfulControllerParam, void>;
    private newUserController: Controller<RestfulControllerParam, void>;
    private updateUserController: Controller<RestfulControllerParam, void>;
    private removeUserController: Controller<RestfulControllerParam, void>;

    // Constructors:
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(UserRestfulApi.path, domainManager);

        this.userInfoConverter = new UserInfoConverter();

        this.getUsersByKeywordController = this.methodUnimplementedController;
        this.getAllUsersController = this.methodUnimplementedController;
        this.getUserController = this.methodUnimplementedController;
        this.newUserController = this.methodUnimplementedController;
        this.updateUserController = this.methodUnimplementedController;
        this.removeUserController = this.methodUnimplementedController;
    }

    // Methods:
    public async get(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>): Promise<void> {
        // Get method
        const method: string | undefined = request.query.method as string | undefined;

        // Get controller
        let controller: Controller<RestfulControllerParam, void>;

        switch (method) {
            case 'getByKeyword': {
                controller = this.getUsersByKeywordController;
                break;
            }

            case 'getAll': {
                controller = this.getAllUsersController;
                break;
            }

            case 'get': {
                controller = this.getUserController;
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
        return this.newUserController.execute({ request, response });
    }

    public async put(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>): Promise<void> {
        return this.updateUserController.execute({ request, response });
    }

    public async delete(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>): Promise<void> {
        return this.removeUserController.execute({ request, response });
    }
}