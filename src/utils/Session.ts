export default class Session {
    // Fields:
    private values: SessionValues;

    // Constructors:
    public constructor(values?: SessionValues) {
        this.values = (values || {});
    }

    // Methods:
    public put(key: string, value: SessionValue): void {
        this.values[key] = value;
    }

    public get(key: string): SessionValue | undefined {
        return this.values[key];
    }
}

type SessionValues = { [ index: string]: SessionValue };
type SessionValue = any;