import Converter from "./Converter";

export default interface AsyncConverter<F, T> extends Converter<F, Promise<T>> {
    
}