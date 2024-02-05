export default interface DBHandler<T, P> {
    get(pKey: P): Promise<T | undefined>
    getAll(): Promise<T[]>
    getByFilter(filter: any): Promise<T[]>
    insert(target: T): Promise<void>
    update(target: T): Promise<void>
    remove(target: T): Promise<void>
    removeByPrimaryKey(pKey: P): Promise<void>
}