import User from "../../collections/User";
import Trigger from "../../types/Trigger";

const triggerInsteadOfInsertUser: Trigger = async function(inserted, deleted): Promise<void> {
    //Id check
    const email: string = inserted.email;
    if(!email) {
        throw new Error("Mã thương hiệu không được rỗng!");
    }

    if((await User.select({email})).length > 0) {
        throw new Error(`Đã tồn tại người dùng với email ${email}!`);
    }

    //Password check
    const password: string = inserted.password;
    if(!password) {
        throw new Error("Mật khẩu không được để trống!");
    }

    //Fullname check
    const fullName: string =  inserted.fullName;
    if(!fullName) {
        throw new Error("Họ tên không được để trống!")
    }

    if(fullName.length <= 5) {
        throw new Error("Họ tên phải có ít nhất 5 ký tự!");
    }

    //Phonenumber check
    const phoneNumer = inserted.phoneNumber;
    if(!phoneNumer) {
        throw new Error("Số điện thoại không được để trống!");
    }

    const regexPhoneNumber: RegExp = /^(0|\+84)(\d{9,10})$/;
    if(!regexPhoneNumber.test(phoneNumer)) {
        throw new Error("Số điện thoại không hợp lệ!");
    }

    //Address check
    const address: string =  inserted.address;
    if(!address) {
        throw new Error("Địa chỉ không được để trống!")
    }

    if(fullName.length <= 25) {
        throw new Error("Địa chỉ phải có ít nhất 25 ký tự!");
    }

    //Avatar
    const avatar = inserted.avatar;
    if(!avatar) {
        throw new Error("Ảnh đại diện không được để trống!");
    }

    //Permissio check
    const permission: string = inserted.permission;
    if(!["CUSTOMER", "EMPLOYEE", "MANAGER"].includes(permission)){
        throw new Error("Quyền truy cập không hợp lệ!");
    }
}

export default triggerInsteadOfInsertUser;