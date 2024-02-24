import VerificationCodeData from "../../persistence/data/VerificationCodeData";
import ReversableConverter from "../../utils/interfaces/ReversableConverter";
import User from "../entities/User";
import VerificationCode from "../entities/VerificationCode";

export default class VerificationCodeConverter implements ReversableConverter<VerificationCodeData, VerificationCode> {
    // Fields:

    // Constructor:
    public constructor() {

    }

    // Methods:
    public convert(from: VerificationCodeData): VerificationCode {
        const verificationCode = new VerificationCode();

        const user: User = new User();
        user.Email = from.email;

        verificationCode.User = user;
        verificationCode.Code = from.code;
        verificationCode.Type = from.type;
        verificationCode.CreationTime = from.creationTime;
        verificationCode.LifeTime = from.lifeTime;        

        return verificationCode;
    }

    public reverse(from: VerificationCode): VerificationCodeData {
        return {
            email: from.User?.Email as string,
            code: from.Code as string,
            type: from.Type as string,
            creationTime: from.CreationTime as string,
            lifeTime: from.LifeTime as number
        };
    }
}