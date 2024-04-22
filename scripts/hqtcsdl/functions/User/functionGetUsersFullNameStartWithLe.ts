import User from "../../collections/User";

export default async function functionGetUsersFullNameStartWithLe(): Promise<any> {
    // Select user with given conditions
    return User.select(
        (user: any) => (user.fullName as string).toLowerCase()
            .startsWith("lê")
    );
}