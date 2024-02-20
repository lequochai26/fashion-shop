export default class VerificationCode {
    // Fields:
    private code?: string | undefined;
    private type?: string | undefined;
    private creationTime?: string | undefined;
    private lifeTime?: number | undefined;

    // Constructor:
    public constructor(
        code?: string | undefined,
        type?: string | undefined,
        creationTime?: string | undefined,
        lifeTime?: number | undefined
    ) {
        this.code = code;
        this.type = type;
        this.creationTime = creationTime;
        this.lifeTime = lifeTime
    }

    // Methods:
    public get Code(): string | undefined {
        return this.code;
    }

    public set Code(code: string | undefined) {
        this.code = code;
    }

    public get Type(): string | undefined {
        return this.type;
    }

    public set Type(type: string | undefined) {
        this.type = type;
    }

    
    public get CreationTime(): string | undefined {
        return this.creationTime;
    }

    
    public set CreationTime(creationTime: string | undefined) {
        this.creationTime = creationTime;
    }
    
    
    public get LifeTime(): number | undefined {
        return this.lifeTime;
    }
    
    
    public set LifeTime(lifeTime: number | undefined) {
        this.lifeTime = lifeTime;
    }
    
}