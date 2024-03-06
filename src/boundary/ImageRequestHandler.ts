import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import DefaultRequestHandler from "./base_classes/DefaultRequestHandler";
import fs from 'fs';

export default class ImageRequestHandler extends DefaultRequestHandler {
    // Static fields:
    private static path: string = "/image";
    
    // Fields:
    private fs;

    // Constructor:
    public constructor() {
        super(ImageRequestHandler.path);
        this.fs = fs;
    }

    // Private methods:
    private imageNotFoundResponse(response: Response): void {
        response.sendFile(
            `${process.cwd()}/assets/imageNotFound.png`
        );
    }

    // Methods:
    public async get(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>): Promise<void> {
        // Get path parameter from request
        const path: string | undefined = request.query.path as string | undefined;

        // Path parameter not found case
        if (!path) {
            return this.imageNotFoundResponse(response);
        }

        // File at given path not found case
        if (!this.fs.existsSync(path)) {
            return this.imageNotFoundResponse(response);
        }

        // Image responding
        response.sendFile(
            path.replace(
                "./",
                process.cwd() + "/"
            )
        );
    }
}