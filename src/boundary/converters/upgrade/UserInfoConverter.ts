import User from "../../../domain/entities/upgrade/User";
import AsyncConverter from "../../../utils/interfaces/AsyncConverter";
import UserInfo from "../../infos/user/UserInfo";

export default class UserInfoConverter implements AsyncConverter<User, UserInfo> {
    // Constructors:
    public constructor() {

    }

    // Methods:
    public async convert(from: User): Promise<UserInfo> {
        return {
            address: from.Adress as string,
            avatar: from.Avatar as string,
            createdOrders: (await from.getCreatedOrders()).map(
                order => order.Id as string
            ),
            email: from.Email as string,
            fullName: from.FullName as string,
            gender: from.Gender as boolean,
            orderedOrders: (await from.getOrderedOrders()).map(
                order => order.Id as string
            ),
            permission: from.Permission as string,
            phoneNumber: from.PhoneNumber as string,
            wallet: from.Wallet
        };
    }
}