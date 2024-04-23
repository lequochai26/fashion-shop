import User from "../../collections/User";

export default async function GetUsersWithFullNameStartByNguyen():Promise<any> {
    function startsWithNguyen(user:any):boolean{
        //
        const fullNameLowerCase = (user.fullName as string).toLowerCase();

        return fullNameLowerCase.startsWith("nguyễn");
    }

    return User.select(startsWithNguyen);
}