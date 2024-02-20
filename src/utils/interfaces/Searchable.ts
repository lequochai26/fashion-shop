export default interface Searchable<T> {
    search(keyword: string): Promise<T[]>
}