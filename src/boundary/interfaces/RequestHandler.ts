import { Request, Response } from "express";

export default interface RequestHandler {
    get(request: Request, response: Response): Promise<void>;
    post(request: Request, response: Response): Promise<void>;
    put(request: Request, response: Response): Promise<void>;
    del(request: Request, response: Response): Promise<void>;
    getPath(): string;
}