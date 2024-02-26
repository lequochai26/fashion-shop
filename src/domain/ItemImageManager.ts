import PersistenceHandler from "../persistence/PersistenceHandler";
import ReversableConverter from "../utils/interfaces/ReversableConverter";
import EntityManager from "./EntityManager";
import PersistenceHandlerHolder from "./PersistenceHandlerHolder";
import Item from "./entities/Item";
import ItemImage from "./entities/ItemImage";
import ItemImageData from "../persistence/data/ItemImageData";
import ItemImagePrimaryKey from "../persistence/pkeys/ItemImagePrimaryKey";

export default class ItemImageManager extends PersistenceHandlerHolder implements EntityManager<ItemImage, ItemImagePrimaryKey> {

    //Fields

    //Constructor

    //Private Methods

    //Methods
    get(pKey: ItemImagePrimaryKey, path: any[]): Promise<ItemImage | undefined> {
        throw new Error("Method not implemented.");
    }
    getAll(path: any[]): Promise<ItemImage[]> {
        throw new Error("Method not implemented.");
    }
    getByFilter(filter: any, path: any[]): Promise<ItemImage[]> {
        throw new Error("Method not implemented.");
    }
    insert(target: ItemImage): Promise<void> {
        throw new Error("Method not implemented.");
    }
    update(target: ItemImage): Promise<void> {
        throw new Error("Method not implemented.");
    }
    remove(target: ItemImage): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeByPrimaryKey(pKey: ItemImagePrimaryKey): Promise<void> {
        throw new Error("Method not implemented.");
    }

}
