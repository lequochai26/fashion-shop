import DomainManager from "../../../domain/DomainManager";
import DeleteFileController from "../DeleteFileController";
import WriteFileNamingByDateTimeController from "../WriteFileNamingByDateTimeController";
import Controller from "../interfaces/Controller";
import RestfulController from "./RestfulController";

export default abstract class UpdateItemRestfulController extends RestfulController {
    // Static fields:
    private static writeFileNamingByDateTimeController: Controller<{ destination: string, file: Express.Multer.File }, string> = new WriteFileNamingByDateTimeController();
    private static deleteFileController: Controller<string, void> = new DeleteFileController();
    protected static itemImagesStoragePath: string = "./assets/itemImages";

    // Fields:
    protected writeFileNamingByDateTimeController: Controller<{ destination: string, file: Express.Multer.File }, string>;
    protected deleteFileController: Controller<string, void>;

    // Constructor:
    public constructor(domainManager?: DomainManager | undefined) {
        super(domainManager);

        this.writeFileNamingByDateTimeController = UpdateItemRestfulController.writeFileNamingByDateTimeController;

        this.deleteFileController = UpdateItemRestfulController.deleteFileController;
    }
}