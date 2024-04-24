import User from "../../collections/User";

export default async function procedureUserGenderMale():Promise<any> {
    return User.select((user: any) => (user.gender as boolean)
        .valueOf() === true
    );
}