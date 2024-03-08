export default interface Validator<P, R> {
    validate(target: P): R;
}