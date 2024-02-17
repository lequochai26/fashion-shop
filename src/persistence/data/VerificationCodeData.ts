export default interface VerificationCodeData {
    email: string,
    code: string,
    type: string,
    creationTime: string,
    lifeTime: number
};