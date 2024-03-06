import DomainManager from "../../../domain/DomainManager";
import DeleteFileController from "../DeleteFileController";
import WriteFileNamingByDateTimeController from "../WriteFileNamingByDateTimeController";
import Controller from "../interfaces/Controller";
import RestfulController from "./RestfulController";

export default abstract class UpdateItemRestfulController extends RestfulController {
    // Fields:
    protected writeFileNamingByDateTimeController: Controller<{ destination: string, extension: string, buffer: Buffer }, string>;
    protected deleteFileController: Controller<string, void>;

    // Constructor:
    public constructor(domainManager?: DomainManager | undefined) {
        super(domainManager);

        this.writeFileNamingByDateTimeController = new WriteFileNamingByDateTimeController();

        this.deleteFileController = new DeleteFileController();
    }
}