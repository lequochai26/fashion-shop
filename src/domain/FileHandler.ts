import crypto from 'crypto';
import fs from 'fs';

export default class FileHandler {
    // Constructors:
    public constructor() {

    }

    // Methods:
    public writeAutoName(path: string, file: Express.Multer.File): string {
        // Make directory if path is not exists
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }

        // Get extension from file
        const extension = this.getExtension(file);

        // Generate name
        const name = `${this.generateName()}.${extension}`;

        // Get write path
        const writePath: string = `${path}/${name}`;

        // File writing
        fs.writeFileSync(writePath, file.buffer);

        // Return write path
        return name;
    }

    public delete(path: string): void {
        // Delete file
        fs.unlinkSync(path);
    }

    public isImageFile(file: Express.Multer.File): boolean {
        return this.getType(file) === 'image';
    }

    public getFileNameFromPath(path: string): string {
        const pathSplitted: string[] = path.split("/");
        return pathSplitted[pathSplitted.length-1];
    }
    
    // Private methods:
    private generateName(): string {
        return crypto.createHash('sha256')
            .update(
                new Date()
                    .getTime()
                    .toString()
            )
            .digest('hex');
    }

    private getExtension(file: Express.Multer.File): string {
        return file.originalname.split(".")[1];
    }

    private getType(file: Express.Multer.File): string {
        return file.mimetype.split("/")[0];
    }
}