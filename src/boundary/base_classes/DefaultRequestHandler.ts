import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import RequestHandler from "../interfaces/RequestHandler";

export default class DefaultRequestHandler implements RequestHandler {
    // Fields:
    private path: string;

    // Constructor:
    public constructor(path: string) {
        this.path = path;
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
}