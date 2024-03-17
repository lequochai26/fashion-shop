import FileHandleController from "./abstracts/FileHandleController";

export default class WriteFileNamingByDateTimeController extends FileHandleController<{ destination: string, file: Express.Multer.File }, string> {
    // Constructor:
    public constructor() {
        super();
    }

    // Methods:
    public async execute({ destination, file }: { destination: string, file: Express.Multer.File }): Promise<string> {
        // Generate id
        const id: string = new Date().getTime().toString();

        // Get file extension
        let extension: string = "";
        const nameInfo: string[] = file.filename.split(".");
        if (nameInfo.length > 1) {
            extension = nameInfo[nameInfo.length-1];
        }

        // Get file name
        const fileName: string = id + (extension.length > 0 ? '.' : '') + extension;

        // Make sure destination exist
        if (!this.fs.existsSync(destination)) {
            this.fs.mkdirSync(destination);
        }

        // Get path to write
        const path: string = destination + (destination.charAt(destination.length-1) !== "/" ? "/" : "") + fileName;

        // Writing
        this.fs.writeFileSync(path, file.buffer);

        // Return id after wrote
        return path;
    }
}