import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import DomainManager from "../domain/DomainManager";
import RestfulApi from "./abstracts/RestfulApi";

export default class ItemRestfulApi extends RestfulApi {
    // Static fields:
    private static path: string = "/item";

    // Constructors:
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(
            ItemRestfulApi.path,
            domainManager
        );
    }

    // Methods:
    public async get(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>): Promise<void> {
        response.json(
            {
                success: true,
                message: "Hello World!"
            }
        );
    }
}