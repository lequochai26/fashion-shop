/**
 * Phiên làm việc của người dùng
 */
export default class Session {
    // Fields:
    private values: SessionValues;

    // Constructors:
    /**
     * Tạo mới một phiên làm việc
     * @param values Dữ liệu cung cấp sẵn cho phiên làm việc này
     */
    public constructor(values?: SessionValues) {
        this.values = (values || {});
    }

    // Methods:
    /**
     * Lưu trữ một dữ liệu vào phiên làm việc này
     * @param key Khóa cho dữ liệu lưu trong phiên (được sử dụng để truy vấn sau này)
     * @param value Dữ liệu lưu trữ vào phiên làm việc này
     */
    public put(key: string, value: SessionValue): void {
        this.values[key] = value;
    }

    /**
     * Truy vấn dữ liệu bất kỳ được lưu trong phiên làm việc này thông qua khóa (key)
     * @param key Khóa tương ứng với dữ liệu được lưu trong phiên này
     * @returns Dữ liệu được lưu trong phiên này
     */
    public get(key: string): SessionValue | undefined {
        return this.values[key];
    }
}

type SessionValues = { [ index: string]: SessionValue };
type SessionValue = any;