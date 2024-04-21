import AsyncConverter from "./AsyncConverter";
import Reversable from "./Reversable";

export default interface AsyncReversableConverter<F, T> extends AsyncConverter<F, T>, Reversable<T, Promise<F>> {
    
}