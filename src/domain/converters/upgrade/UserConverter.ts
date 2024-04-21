import UserData from "../../../persistence/data/UserData";
import AsyncReversableConverter from "../../../utils/interfaces/AsyncReversableConverter";
import User from "../../entities/upgrade/User";

export default class UserConverter implements AsyncReversableConverter<UserData,User>{
    //Fields:
    //Constructor:
    public constructor(){

    }

    //Methods:
    public async convert(from: UserData) : Promise<User> {
        const user = new User();

        user.Email = from.email;
        user.Password = from.password;
        user.FullName = from.fullName;
        user.Gender = from.gender;
        user.PhoneNumber = from.phoneNumber;
        user.Adress = from.address;
        user.Avatar = from.avatar;
        user.Permission = from.permission;
        user.Wallet = from.wallet;

        return user;
    } 

    public async reverse(from: User): Promise<UserData> {
        return{
            email: from.Email as string,
            password: from.Password as string, 
            fullName: from.FullName as string,
            gender: from.Gender as boolean,
            phoneNumber: from.PhoneNumber as string,
            address: from.Adress as string,
            avatar: from.Avatar as string,
            permission: from.Permission as string,
            wallet: from.Wallet
        }
    }
}