import Order from "../../collections/Order";
import User from "../../collections/User";

export default async function procedureGetUsersOrderedMoreThan1Order():Promise<any> {
    
    let users:any[] = await User.select();

    let result:any[] = [];

    for(const user of users){
        if((await Order.select({orderedBy: user.email})).length > 1){
            result.push(user);
        }
    }
    
    return result;
}