import { Request, Response } from "express";
import DomainManager from "../../domain/DomainManager";
import User from "../../domain/entities/User";
import Session from "../../utils/Session";
import RestfulError from "../errors/RestfulError";
import DomainManagerHolder from "./base_classes/DomainManagerHolder";
import Controller from "./interfaces/Controller";

export default class LoginValidateController extends DomainManagerHolder implements Controller<LoginValidateParam, LoginValidatePath> {
    // Constructors:
    public constructor(
        domainManager?: DomainManager | undefined
    ) {
        super(domainManager);
    }

    // Methods:
    public async execute({ request, path }: LoginValidateParam): Promise<LoginValidatePath> {
        // Get session from request
        const session: Session = (request as any).session;

        // Get user's email from session
        const email: string | undefined = session.get("user");

        // Not logged in case
        if (!email) {
            throw new RestfulError(
                "Not logged in!",
                "NOT_LOGGED_IN"
            );
        }

        // Get user from given email
        const user: User | undefined = await this.useDomainManager(
            async domainManager => domainManager.getUser(email, path)
        );

        // User not exist
        if (!user) {
            // Logout
            session.remove("user");

            // Throw RestfulError
            throw new RestfulError(
                "User not exist!",
                "USER_NOT_EXIST"
            );
        }

        // Return
        return { session, email, user };
    }
}

export interface LoginValidateParam {
    request: Request,
    path: any[]
}

export interface LoginValidatePath {
    session: Session,
    email: string,
    user: User
}