import User from "../../collections/User";

export default async function procedureGetUserByKeyword(keyword: string): Promise<any> {
    if(!keyword) {
        throw new Error("Chưa cung cấp từ khoá tìm kiếm!");
    }

    return User.select(
        (user: any) => (`${user.fullName} ${user.address} ${user.email} ${user.permission} ${user.gender? "nam" : "nữ"}`.toLowerCase().includes(keyword.toLowerCase()))
    );
}