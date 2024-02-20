import { Document, WithId } from "mongodb";
import Converter from "../utils/interfaces/Converter";
import DBHandler from "./DBHandler";
import UserData from "./data/UserData";
import { get, getAll, getByFilter, insert, remove, update } from "./Connector";

export default class UserDBHandler implements DBHandler<UserData, string>{
    //fields:
    private userDataConverter: Converter<WithId<Document>, UserData>;

    private static collectionName :string = "User";

    //constructor
    public constructor(userDataConverter : Converter<WithId<Document>, UserData>){
        this.userDataConverter = userDataConverter;
    }

    async get(pKey: string): Promise<UserData | undefined> {
        const filter = {
            email: pKey
        };

        const document : WithId<Document> | null = await get(UserDBHandler.collectionName, filter);

        if(!document){
            return;
        };

        return this.userDataConverter.convert(document);
    }

    async getAll(): Promise<UserData[]> {
        const documents: WithId<Document>[] = await getAll(UserDBHandler.collectionName);

        const userDataList : UserData[] = [];

        for(const document of documents){
            userDataList.push(
                this.userDataConverter.convert(document)
            );
        }

        return userDataList;
    }

    async getByFilter(filter: any): Promise<UserData[]> {
        const documents : WithId<Document>[] = await getByFilter(UserDBHandler.collectionName, filter);

        const userDataList : UserData[] = [];
         
        for(const document of documents){
            userDataList.push(
                this.userDataConverter.convert(document)
            );
        }

        return userDataList;
    }

    async insert(target: UserData): Promise<void> {
        await insert(UserDBHandler.collectionName, target);
    }

    async update(target: UserData): Promise<void> {
        const pKey = {
             email: target.email
        }
        
        await update(UserDBHandler.collectionName, target,pKey);
    }

    async remove(target: UserData): Promise<void> {
        await this.removeByPrimaryKey(target.email);
    }

    async removeByPrimaryKey(email: string): Promise<void> {
        const pKey = {
            email : email
        }
        await remove(UserDBHandler.collectionName, pKey);
    }
    
}