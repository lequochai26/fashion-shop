import FileHandleController from "./abstracts/FileHandleController";

export default class WriteFileNamingByDateTimeController extends FileHandleController<{ destination: string, extension: string, buffer: Buffer }, string> {
    // Constructor:
    public constructor() {
        super();
    }

    // Methods:
    public async execute({ destination, extension, buffer }: { destination: string; extension: string; buffer: Buffer; }): Promise<string> {
        // Generate id
        const id: string = new Date().getTime().toString();

        // Get file name
        const fileName: string = id + (extension.charAt(0) !== "." ? "." : "") + extension;

        // Make sure destination exist
        if (!this.fs.existsSync(destination)) {
            this.fs.mkdirSync(destination);
        }

        // Get path to write
        const path: string = destination + (destination.charAt(destination.length-1) !== "/" ? "/" : "") + fileName;

        // Writing
        this.fs.writeFileSync(path, buffer);

        // Return id after wrote
        return path;
    }
}