export default interface Controller<P, R> {
    execute(param: P): Promise<R>;
}