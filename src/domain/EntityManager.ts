export default interface EntityManager<T, P> {
    get(pKey: P, path: any[]): Promise<T | undefined>
    getAll(path: any[]): Promise<T[]>
    getByFilter(filter: any, path: any[]): Promise<T[]>
    insert(target: T): Promise<void>
    update(target: T): Promise<void>
    remove(target: T): Promise<void>
    remove(pKey: P): Promise<void>
}