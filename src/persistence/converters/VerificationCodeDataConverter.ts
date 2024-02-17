import { Document, WithId } from "mongodb";
import Converter from "../../utils/interfaces/Converter";
import VerificationCodeData from "../data/VerificationCodeData";

export default class VerificationCodeDataConverter implements Converter<WithId<Document>, VerificationCodeData> {
    // Constructor:
    public constructor() {

    }

    // Methods:
    public convert(from: WithId<Document>): VerificationCodeData {
        return {
            email: from.email,
            code: from.code,
            type: from.type,
            creationTime: from.creationTime,
            lifeTime: from.lifeTime
        };
    }
}