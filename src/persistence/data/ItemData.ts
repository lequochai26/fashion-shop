export default interface ItemData{
    id: string;
    avatar: string;
    name: string;   
    description: string;    
    price: number;    
    amount: number;    
    gender: boolean;   
    metadata?: string | undefined;
    type?: string | undefined;
    brand?: string | undefined;
}