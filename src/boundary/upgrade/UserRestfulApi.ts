import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import User from "../../domain/entities/upgrade/User";
import DomainManager from "../../domain/upgrade/DomainManager";
import AsyncConverter from "../../utils/interfaces/AsyncConverter";
import RestfulApi from "../base_classes/upgrade/RestfulApi";
import Controller from "../controllers/interfaces/Controller";
import RestfulControllerParam from "../controllers/interfaces/RestfulControllerParam";
import CancelThirdPartyAccountRegistrationController from "../controllers/upgrade/CancelThirdPartyAccountRegistrationController";
import GetAllUsersController from "../controllers/upgrade/GetAllUsersController";
import GetLoggedInUserController from "../controllers/upgrade/GetLoggedInUserController";
import GetThirdPartyAccountController from "../controllers/upgrade/GetThirdPartyAccountController";
import GetUserController from "../controllers/upgrade/GetUserController";
import GetUsersByKeyWordController from "../controllers/upgrade/GetUsersByKeyWordController";
import LoginController from "../controllers/upgrade/LoginController";
import LoginWithFacebookController from "../controllers/upgrade/LoginWithFacebookController";
import LogoutController from "../controllers/upgrade/LogoutController";
import { NewUserController } from "../controllers/upgrade/NewUserController";
import RegisterController from "../controllers/upgrade/RegisterController";
import RemoveUserController from "../controllers/upgrade/RemoveUserController";
import ThirdPartyAccountRegistrationFinishController from "../controllers/upgrade/ThirdPartyAccountRegistrationFinishController";
import UpdatePersonalInfoController from "../controllers/upgrade/UpdatePersonalInfoController";
import UpdateUserController from "../controllers/upgrade/UpdateUserController";
import UpgradedChangePasswordController from "../controllers/upgrade/UpgradedChangePasswordController";
import UserInfoConverter from "../converters/upgrade/UserInfoConverter";
import UserInfo from "../infos/user/UserInfo";

export default class UserRestfulApi extends RestfulApi {
    // Static fields:
    private static path: string = "/user";

    // Fields:
    private userInfoConverter: AsyncConverter<User, UserInfo>;
    private getUsersByKeywordController: Controller<RestfulControllerParam, void>;
    private getAllUsersController: Controller<RestfulControllerParam, void>;
    private getUserController: Controller<RestfulControllerParam, void>;
    private getLoggedInUserController: Controller<RestfulControllerParam, void>;
    private getThirdPartyAccounntController: Controller<RestfulControllerParam, void>;
    private newUserController: Controller<RestfulControllerParam, void>;
    private loginController: Controller<RestfulControllerParam, void>;
    private logoutController: Controller<RestfulControllerParam, void>;
    private registerController: Controller<RestfulControllerParam, void>;
    private loginWithFacebookController: Controller<RestfulControllerParam, void>;
    private thirdPartyAccountRegistrationFinishController: Controller<RestfulControllerParam, void>;
    private updateUserController: Controller<RestfulControllerParam, void>;
    private changePasswordController: Controller<RestfulControllerParam, void>;
    private updatePersonalInfoController: Controller<RestfulControllerParam, void>;
    private removeUserController: Controller<RestfulControllerParam, void>;
    private cancelThirdPartyAccountRegistrationController: Controller<RestfulControllerParam, void>;

    // Constructors:
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(UserRestfulApi.path, domainManager);

        this.userInfoConverter = new UserInfoConverter();

        this.getUsersByKeywordController = new GetUsersByKeyWordController(this.userInfoConverter, this.domainManager);
        this.getAllUsersController = new GetAllUsersController(this.userInfoConverter, this.domainManager);
        this.getUserController = new GetUserController(this.userInfoConverter, this.domainManager);
        this.getLoggedInUserController = new GetLoggedInUserController(this.userInfoConverter, this.domainManager);
        this.getThirdPartyAccounntController = new GetThirdPartyAccountController(this.userInfoConverter, this.domainManager);
        this.newUserController = new NewUserController(this.domainManager);
        this.loginController = new LoginController(this.domainManager);
        this.logoutController = new LogoutController(this.domainManager);
        this.registerController = new RegisterController(this.newUserController);
        this.loginWithFacebookController = new LoginWithFacebookController(this.domainManager);
        this.thirdPartyAccountRegistrationFinishController = new ThirdPartyAccountRegistrationFinishController(this.domainManager);
        this.updateUserController = new UpdateUserController(this.domainManager);
        this.changePasswordController = new UpgradedChangePasswordController(this.domainManager);
        this.updatePersonalInfoController = new UpdatePersonalInfoController(this.updateUserController, domainManager);
        this.removeUserController = new RemoveUserController(this.domainManager);
        this.cancelThirdPartyAccountRegistrationController = new CancelThirdPartyAccountRegistrationController(this.domainManager);
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

            case 'getThirdPartyAccount': {
                controller = this.getThirdPartyAccounntController;
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

            case 'loginWithFacebook': {
                controller = this.loginWithFacebookController;
                break;
            }

            case 'thirdPartyAccountRegistrationFinish': {
                controller = this.thirdPartyAccountRegistrationFinishController;
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
        const method: string | undefined = request.query.method as string | undefined;

        let controller: Controller<RestfulControllerParam, void>;

        switch(method) {
            case 'remove': {
                controller = this.removeUserController;
                break;
            }

            case 'cancelThirdPartyAccountRegistration': {
                controller = this.cancelThirdPartyAccountRegistrationController;
                break;
            }

            default: {
                controller = this.invalidMethodController;
            }
        }

        // Execute controller
        return controller.execute({ request, response });
    }
}