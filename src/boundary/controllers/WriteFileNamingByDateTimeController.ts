import Controller from "./interfaces/Controller";
import fs from 'fs';

export default class WriteFileNamingByDateTimeController implements Controller<{ destination: string, extension: string, buffer: Buffer }, string> {
    // Fields:
    private fs;

    // Constructor:
    public constructor() {
        this.fs = fs;
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