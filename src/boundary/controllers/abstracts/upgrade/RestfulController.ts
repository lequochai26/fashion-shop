import { Request } from "express";
import DomainManager from "../../../../domain/upgrade/DomainManager";
import Controller from "../../interfaces/Controller";
import RestfulControllerParam from "../../interfaces/RestfulControllerParam";

export default abstract class RestfulController implements Controller<RestfulControllerParam, void> {
    // Fields:
    protected domainManager?: DomainManager | undefined;

    // Constructor:
    public constructor(domainManager?: DomainManager | undefined) {
        this.domainManager = domainManager;
    }

    // Protected methods:
    protected async useDomainManager<T>(
        executable: (domainManager: DomainManager) => Promise<T>
    ): Promise<T> {
        if (!this.domainManager) {
            throw new Error("domainManager field is missing!");
        }

        return executable(this.domainManager);
    }

    protected getFiles(request: Request, fieldName: string): Express.Multer.File[] {
        // Result initialization
        const result: Express.Multer.File[] = [];

        // Getting
        if (!request.files) {
            return result;
        }

        if (!(request.files instanceof Array)) {
            return result;
        }

        for (const file of request.files) {
            if (file.fieldname !== fieldName) {
                continue;
            }

            result.push(file);
        }

        // Return result
        return result;
    }

    // Methods:
    public abstract execute(param: RestfulControllerParam): Promise<void>;
}