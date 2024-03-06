import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import DefaultRequestHandler from "./base_classes/DefaultRequestHandler";

export default class ImageRequestHandler extends DefaultRequestHandler {
    // Static fields:
    private static path: string = "/image";

    // Constructor:
    public constructor() {
        super(ImageRequestHandler.path);
    }

    // Methods:
    public async get(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>): Promise<void> {
        
    }
}