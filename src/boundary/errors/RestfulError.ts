export default class RestfulError extends Error {
    // Fields:
    public code?: string | undefined;

    // Constructors:
    public constructor(
        message?: string | undefined,
        code?: string | undefined
    ) {
        super(message);
        this.code = code;
    }

    // Getters / setters:
    public get Code() {
        return this.code;
    }
    public set Code(value) {
        this.code = value;
    }
}