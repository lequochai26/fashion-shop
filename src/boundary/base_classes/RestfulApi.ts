import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import RequestHandler from "../interfaces/RequestHandler";
import DomainManager from "../../domain/DomainManager";
import Controller from "../controllers/interfaces/Controller";
import RestfulControllerParam from "../controllers/interfaces/RestfulControllerParam";
import InvalidMethodController from "../controllers/InvalidMethodController";
import MethodUnimplementedController from "../controllers/MethodUnimplementedController";

export default class RestfulApi implements RequestHandler {
    // Static fields:
    private static invalidMethodController: Controller<RestfulControllerParam, void> = new InvalidMethodController();
    private static methodUnimplmentedController: Controller<RestfulControllerParam, void> = new MethodUnimplementedController();

    // Fields:
    protected path: string;
    protected domainManager?: DomainManager | undefined;
    protected invalidMethodController: Controller<RestfulControllerParam, void>;
    protected methodUnimplementedController: Controller<RestfulControllerParam, void>;

    // Constructor:
    public constructor(
        path: string,
        domainManager?: DomainManager | undefined
    ) {
        this.path = path;
        this.domainManager = domainManager;
        this.invalidMethodController = RestfulApi.invalidMethodController;
        this.methodUnimplementedController = RestfulApi.methodUnimplmentedController;
    }

    // Protected methods:
    protected async useDomainManager<T>(
        executable: (domainManager: DomainManager) => Promise<T>
    ): Promise<T> {
        if (!this.domainManager) {
            throw new Error("domainManager field is missing!");
        }

        return executable(this.domainManager);
    }

    // Methods:
    public async get(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>): Promise<void> {
        response.status(405);
        response.end();
    }

    public async post(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>): Promise<void> {
        response.status(405);
        response.end();
    }

    public async put(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>): Promise<void> {
        response.status(405);
        response.end();
    }

    public async delete(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>): Promise<void> {
        response.status(405);
        response.end();
    }
    
    public getPath(): string {
        return this.path;
    }
    
    // Getters / setters:
    public get DomainManager(): DomainManager | undefined {
        return this.domainManager;
    }

    public set DomainManager(domainManager: DomainManager | undefined) {
        this.domainManager = domainManager;
    }
}