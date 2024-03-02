import ItemInfoBrand from "./ItemInfoBrand";
import ItemInfoItemType from "./ItemInfoItemType";

export default interface ItemInfo {
    id: string;
    avatar: string;
    name: string;
    description: string;
    price: number;
    amount: number;
    gender: boolean;
    metadata?: string | undefined;
    type?: ItemInfoItemType | undefined;
    brand?: ItemInfoBrand | undefined;
    images: string[];
    orders: string[];
}