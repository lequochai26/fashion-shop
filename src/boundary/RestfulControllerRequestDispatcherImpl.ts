import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import RestfulControllerRequestDispatcher from "./RestfulControllerRequestDispatcher";
import Controller from "./controllers/interfaces/Controller";
import RestfulControllerParam from "./controllers/interfaces/RestfulControllerParam";

export default class RestfulControllerRequestDispatcherImpl implements RestfulControllerRequestDispatcher {
    // Constructors:
    public constructor() {

    }

    // Methods:
    public async dispatch(from: Controller<RestfulControllerParam, void>, to: Controller<RestfulControllerParam, void>, request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>): Promise<void> {
        // Embedding from into request
        (request as any).dispatchedFrom = from;

        // Call to to execute
        return to.execute({ request, response });
    }
}