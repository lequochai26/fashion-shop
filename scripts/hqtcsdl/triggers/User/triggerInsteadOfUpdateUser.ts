import Trigger from "../../types/Trigger";

const triggerInsteadOfUpdateUser: Trigger = async function (inserted, deleted): Promise<void> {
    //Password check
    const password: string = inserted.password;

    if (password) {
        if(!password) {
            throw new Error("Mật khẩu không được để rỗng!");
        }
    }

    //Fullname
    const fullName: string | undefined = inserted.fullName;
    if (fullName !== undefined) {
        if (!fullName) {
            throw new Error("Họ tên không được để trống!")
        }

        if (fullName.length <= 5) {
            throw new Error("Họ tên phải có ít nhất 5 ký tự!");
        }
    }

    //Phonenumber check
    const phoneNumer: string | undefined = inserted.phoneNumber;
    if (phoneNumer !== undefined) {
        if (!phoneNumer) {
            throw new Error("Số điện thoại không được để trống!");
        }

        const regexPhoneNumber: RegExp = /^(0|\+84)(\d{9,10})$/;
        if (!regexPhoneNumber.test(phoneNumer)) {
            throw new Error("Số điện thoại không hợp lệ!");
        }
    }



    //Address check
    const address: string | undefined = inserted.address;
    if(address !== undefined) {
        if (!address) {
            throw new Error("Địa chỉ không được để trống!")
        }
    
        if (address.length <= 25) {
            throw new Error("Địa chỉ phải có ít nhất 25 ký tự!");
        }
    }


    //Avatar
    const avatar: string | undefined = inserted.avatar;
    if(avatar !== undefined) {
        if (!avatar) {
            throw new Error("Ảnh đại diện không được để trống!");
        }
    }

    //Permissio check
    const permission: string = inserted.permission;
    if(permission !== undefined) {
        if (!["CUSTOMER", "EMPLOYEE", "MANAGER"].includes(permission)) {
            throw new Error("Quyền truy cập không hợp lệ!");
        }
    }
}

export default triggerInsteadOfUpdateUser;