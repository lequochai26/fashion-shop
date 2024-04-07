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

    /**
     * Truy vấn tất cả khóa mà phiên này đang lưu giữ
     * @returns Danh sách khóa
     */
    public getKeys(): string[] {
        return Object.keys(this.values);
    }

    /**
     * Truy vấn tất cả dữ liệu mà phiên này đang lưu giữ
     * @returns Danh sách dữ liệu
     */
    public getValues(): SessionValue[] {
        return Object.values(this.values);
    }
    
    /**
     * Truy vấn tất cả khóa và dữ liệu mà phiên này đang lưu giữ
     * @returns Mảng với phần tử đầu tiên là danh sách khóa và phần tử thứ hai là danh sách dữ liệu
     */
    public getAll(): [ string[], SessionValue[] ] {
        return [
            Object.keys(this.values),
            Object.values(this.values)
        ];
    }

    /**
     * Xóa dữ liệu tương ứng với khóa được lưu trong phiên này
     * @param key Khóa
     */
    public remove(key: string): void {
        if (!this.values[key]) {
            throw new Error(`No item with the key "${key}" exist in this session!`);
        }

        delete(this.values[key]);
    }

    /**
     * Chuyển đổi tất cả giá trị được lưu trong phiên làm việc này thành JSON.
     * @returns JSON
     */
    public toJSON() {
        return this.values;
    }
}

type SessionValues = { [ index: string]: SessionValue };
type SessionValue = any;