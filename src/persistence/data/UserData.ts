export default interface UserData{
    email : string;
    password : string;
    fullName: string;
    gender: boolean;
    phoneNumber: string;
    address: string;
    avatar: string;
    permission: string;
    wallet?: string | undefined;
}