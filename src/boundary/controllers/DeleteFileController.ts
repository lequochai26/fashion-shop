import Controller from "./interfaces/Controller";
import fs from 'fs';

export default class DeleteFileController implements Controller<string, void> {
    // Fields:
    private fs;

    // Constructor:
    public constructor() {
        this.fs = fs;
    }

    // Methods:
    public async execute(path: string): Promise<void> {
        this.fs.unlinkSync(path);
    }
}