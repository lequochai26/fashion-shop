import EntityManager from "./EntityManager";
import GettableByFilterFunc from "./interfaces/GettableByFilterFunc";

export default interface GettableByFilterFuncEntityManager<T, P> extends EntityManager<T, P>, GettableByFilterFunc<T> {

}