/**
 * Bộ chuyển đổi kiểu dữ liệu từ F -> T.
 * @param F Kiểu dữ liệu đầu vào
 * @param T Kiểu dữ liệu đầu ra
 */
export default interface Converter<F, T> {
    /**
     * Chuyển đổi đối tượng có kiểu dữ liệu đầu vào ra đối tượng có kiểu dữ liệu đầu vào T.
     * @param from Đối tượng cần chuyển đổi
     * @returns Đối tượng đầu ra
     */
    convert(from: F): T;
}