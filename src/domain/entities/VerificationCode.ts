import User from "./User";

export default class VerificationCode {
    // Fields:
    private user?: User | undefined;
    private code?: string | undefined;
    private type?: string | undefined;
    private creationTime?: string | undefined;
    private lifeTime?: number | undefined;

    // Constructor:
    public constructor(
        user?: User | undefined,
        code?: string | undefined,
        type?: string | undefined,
        creationTime?: string | undefined,
        lifeTime?: number | undefined
    ) {
        this.user = user;
        this.code = code;
        this.type = type;
        this.creationTime = creationTime;
        this.lifeTime = lifeTime
    }

    // Methods:
    public get User(): User | undefined {
        return this.user;
    }

    public set User(user: User | undefined) {
        this.user = user;
    }

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