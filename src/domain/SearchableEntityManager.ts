import Searchable from "../utils/interfaces/Searchable";
import EntityManager from "./EntityManager";
import GettableByFilterFunc from "./interfaces/GettableByFilterFunc";

export default interface SearchableEntityManager<T, P> extends EntityManager<T, P>, Searchable<T>, GettableByFilterFunc<T> {
    
}