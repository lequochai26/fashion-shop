import { Request, Response } from "express";
import Controller from "./controllers/interfaces/Controller";
import RestfulControllerParam from "./controllers/interfaces/RestfulControllerParam";

export default interface RestfulControllerRequestDispatcher {
    dispatch(from: Controller<RestfulControllerParam, void>, to: Controller<RestfulControllerParam, void>, request: Request, response: Response): Promise<void>;
}