import User from "../../domain/entities/User";
import Converter from "../../utils/interfaces/Converter";
import UserInfo from "../infos/user/UserInfo";

export default class UserInfoConverter implements Converter<User, UserInfo> {
    // Constructors:
    public constructor() {

    }

    // Methods:
    public convert(from: User): UserInfo {
        return {
            address: from.Adress as string,
            avatar: from.Avatar as string,
            createdOrders: from.CreatedOrders.map(
                order => order.Id as string
            ),
            email: from.Email as string,
            fullName: from.FullName as string,
            gender: from.Gender as boolean,
            orderedOrders: from.OrderedOrders.map(
                order => order.Id as string
            ),
            permission: from.Permission as string,
            phoneNumber: from.PhoneNumber as string
        };
    }
}