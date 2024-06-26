import ItemInfoBrand from "./ItemInfoBrand";
import ItemInfoItemType from "./ItemInfoItemType";

export default interface ItemInfo {
    id: string;
    avatar: string;
    name: string;
    description: string;
    price: number;
    buyPrice: number;
    amount: number;
    gender: boolean;
    metadata?: any | undefined;
    type?: ItemInfoItemType | undefined;
    brand?: ItemInfoBrand | undefined;
    images: string[];
    orders: string[];
}