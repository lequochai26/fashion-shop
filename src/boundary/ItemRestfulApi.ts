import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import DomainManager from "../domain/DomainManager";
import RestfulApi from "./base_classes/RestfulApi";
import Controller from "./controllers/interfaces/Controller";
import GetAllItemsController from "./controllers/GetAllItemsController";
import RestfulControllerParam from "./controllers/interfaces/RestfulControllerParam";

export default class ItemRestfulApi extends RestfulApi {
    // Static fields:
    private static path: string = "/item";

    // Constructor:
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
        console.log(this.domainManager);

        // Get method query
        const method: string | undefined = request.query.method as (string | undefined);

        // Controller declaration
        let controller: Controller<RestfulControllerParam, void>;

        // Switch method
        switch (method) {
            case 'getAll': {
                controller = new GetAllItemsController(this.domainManager);
                break;
            }

            default: {
                controller = {
                    async execute({ response }: RestfulControllerParam): Promise<void> {
                        response.json(
                            {
                                success: false,
                                message: "Invalid method name or method not found!"
                            }
                        )
                    },
                }
            }
        }

        // Execute controller
        return controller.execute(
            { request: request, response: response }
        );
    }
}