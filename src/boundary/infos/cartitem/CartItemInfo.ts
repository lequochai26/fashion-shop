import CartItemInfoItem from "./CartItemInfoItem";

export default interface CartItemInfo {
    item?: CartItemInfoItem | undefined;
    amount: number;
    metadata: any
}