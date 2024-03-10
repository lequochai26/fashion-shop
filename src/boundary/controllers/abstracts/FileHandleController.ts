import Controller from "../interfaces/Controller";
import fs from 'fs';

export default abstract class FileHandleController<P, R> implements Controller<P, R> {
    // Fields:
    protected fs;

    // Constructor:
    public constructor() {
        this.fs = fs;
    }

    // Methods:
    public abstract execute(param: P): Promise<R>;
}