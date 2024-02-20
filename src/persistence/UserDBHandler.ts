import DBHandler from "./DBHandler";
import UserData from "./data/UserData";

export default class UserDBHandler implements DBHandler<UserData, string>{
    //fields:
    
    
    get(pKey: string): Promise<UserData | undefined> {
        throw new Error("Method not implemented.");
    }
    getAll(): Promise<UserData[]> {
        throw new Error("Method not implemented.");
    }
    getByFilter(filter: any): Promise<UserData[]> {
        throw new Error("Method not implemented.");
    }
    insert(target: UserData): Promise<void> {
        throw new Error("Method not implemented.");
    }
    update(target: UserData): Promise<void> {
        throw new Error("Method not implemented.");
    }
    remove(target: UserData): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeByPrimaryKey(pKey: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
}