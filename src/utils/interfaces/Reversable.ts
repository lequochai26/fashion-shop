/**
 * Bộ đảo ngược kiểu dữ liệu từ F -> T.
 * @param F Kiểu dữ liệu đầu vào
 * @param T Kiểu dữ liệu đầu ra
 */
export default interface Reversable<F, T> {
    /**
     * Đảo ngược đối tượng có kiểu dữ liệu F ra đối tượng có kiểu dữ liệu T.
     * @param from Đối tượng cần đảo ngược
     * @returns Đối tượng đầu ra
     */
    reverse(from: F): T;
}