import Converter from "./Converter";
import Reversable from "./Reversable";

/**
 * Bộ chuyển đổi kiểu dữ liệu, có thể:
 * - Chuyển đổi từ F -> T.
 * - Đảo ngược từ T -> F.
 * @param F Kiểu dữ liệu đầu vào
 * @param T Kiểu dữ liệu đầu ra
 */
export default interface ReversableConverter<F, T> extends Converter<F, T>, Reversable<T, F> {

}