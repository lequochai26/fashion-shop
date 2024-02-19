export default interface OrderData{
    id: string;
    type: string;
    date: Date;
    totalPrice: number;
    metadata: string;
    createdBy: string;
    orderedBy: string;
}