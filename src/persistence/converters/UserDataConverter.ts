import { Document, WithId } from "mongodb";
import Converter from "../../utils/interfaces/Converter";
import UserData from "../data/UserData";

export default class UserDataConverter implements Converter<WithId<Document>,UserData>{
    //constructor
    public constructor(){

    }

    //methods:
    public convert(from: WithId<Document>): UserData{
        return {
            email: from.email,
            password : from.password,
            fullName: from.fullName,
            gender: from.gender,
            phoneNumber: from.phoneNumber,
            address: from.address,
            avatar: from.avater,
            permission: from.permission,
            wallet: from.wallet
        };
    }
}