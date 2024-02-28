import { Request, Response } from "express";

export default interface RequestHandler {
    get(request: Request, response: Response): void;
    post(request: Request, response: Response): void;
    put(request: Request, response: Response): void;
    del(request: Request, response: Response): void;
}