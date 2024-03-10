import FileHandleController from "./abstracts/FileHandleController";

export default class DeleteFileController extends FileHandleController<string, void> {
    // Constructor:
    public constructor() {
        super();
    }

    // Methods:
    public async execute(path: string): Promise<void> {
        this.fs.unlinkSync(path);
    }
}