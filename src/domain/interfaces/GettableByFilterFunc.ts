export default interface GettableByFilterFunc<T> {
    getByFilterFunc(filterFunc: (value: T) => boolean | Promise<boolean>): Promise<T[]>;
}