import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import RequestHandler from "../interfaces/RequestHandler";
import DomainManager from "../../domain/DomainManager";

export default abstract class RestfulApi implements RequestHandler {
    // Fields:
    protected path: string;
    protected domainManager?: DomainManager | undefined;

    // Constructor:
    public constructor(
        path: string,
        domainManager?: DomainManager | undefined
    ) {
        this.path = path;
        this.domainManager = domainManager;
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

    public async del(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>): Promise<void> {
        response.status(405);
        response.end();
    }
    
    public getPath(): string {
        return this.path;
    }
    
}