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
import GetUserController from "./controllers/GetUserController";
import GetAllUsersController from "./controllers/GetAllUsersController";
import GetUsersByKeyWordController from "./controllers/GetUsersByKeyWordController";
import { NewUserController } from "./controllers/NewUserController";
import LoginController from "./controllers/LoginController";
import GetLoggedInUserController from "./controllers/GetLoggedInUserController";
import ChangePasswordController from "./controllers/ChangePasswordController";
import UpdateUserController from "./controllers/UpdateUserController";
import LogoutController from "./controllers/LogoutController";
import UpgradedChangePasswordController from "./controllers/UpgradedChangePasswordController";
import RemoveUserController from "./controllers/RemoveUserController";
import RegisterController from "./controllers/RegisterController";
import UpdatePersonalInfoController from "./controllers/UpdatePersonalInfoController";

export default class UserRestfulApi extends RestfulApi {
    // Static fields:
    private static path: string = "/user";

    // Fields:
    private userInfoConverter: Converter<User, UserInfo>;
    private getUsersByKeywordController: Controller<RestfulControllerParam, void>;
    private getAllUsersController: Controller<RestfulControllerParam, void>;
    private getUserController: Controller<RestfulControllerParam, void>;
    private getLoggedInUserController: Controller<RestfulControllerParam, void>;
    private newUserController: Controller<RestfulControllerParam, void>;
    private loginController: Controller<RestfulControllerParam, void>;
    private logoutController: Controller<RestfulControllerParam, void>;
    private registerController: Controller<RestfulControllerParam, void>;
    private updateUserController: Controller<RestfulControllerParam, void>;
    private changePasswordController: Controller<RestfulControllerParam, void>;
    private updatePersonalInfoController: Controller<RestfulControllerParam, void>;
    private removeUserController: Controller<RestfulControllerParam, void>;

    // Constructors:
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(UserRestfulApi.path, domainManager);

        this.userInfoConverter = new UserInfoConverter();

        this.getUsersByKeywordController = new GetUsersByKeyWordController(this.userInfoConverter, this.domainManager);
        this.getAllUsersController = new GetAllUsersController(this.userInfoConverter, this.domainManager);
        this.getUserController = new GetUserController(this.userInfoConverter, this.domainManager);
        this.getLoggedInUserController = new GetLoggedInUserController(this.domainManager);
        this.newUserController = new NewUserController(this.domainManager);
        this.loginController = new LoginController(this.domainManager);
        this.logoutController = new LogoutController(this.domainManager);
        this.registerController = new RegisterController(this.newUserController);
        this.updateUserController = new UpdateUserController(this.domainManager);
        this.changePasswordController = new UpgradedChangePasswordController(this.domainManager);
        this.updatePersonalInfoController = new UpdatePersonalInfoController(this.updateUserController, domainManager);
        this.removeUserController = new RemoveUserController(this.domainManager);
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

            case 'getLoggedIn': {
                controller = this.getLoggedInUserController;
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
        // Get method
        const method: string | undefined = request.query.method as string | undefined;

        // Get controller
        let controller: Controller<RestfulControllerParam, void>;

        switch (method) {
            case 'new': {
                controller = this.newUserController;
                break;
            }

            case 'login': {
                controller = this.loginController;
                break;
            }

            case 'logout': {
                controller = this.logoutController;
                break;
            }

            case 'register': {
                controller = this.registerController;
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
            case 'update': {
                controller = this.updateUserController;
                break;
            }

            case 'changePassword': {
                controller = this.changePasswordController;
                break;
            }

            case 'updatePersonalInfo': {
                controller = this.updatePersonalInfoController;
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
        return this.removeUserController.execute({ request, response });
    }
}