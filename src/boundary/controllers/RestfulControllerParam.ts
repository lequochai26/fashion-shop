import { Request, Response } from "express";

export default interface RestfulControllerParam {
    request: Request,
    response: Response
};