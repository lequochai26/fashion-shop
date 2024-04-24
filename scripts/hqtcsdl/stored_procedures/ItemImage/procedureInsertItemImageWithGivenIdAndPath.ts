import ItemImage from "../../collections/ItemImage";

export default async function procedureInsertItemImageWithGivenIdAndPath(itemId: string, path: string): Promise<void> {
    if(!itemId) {
        throw new Error("Id không được để trống!");
    }

    if(!path) {
        throw new Error("Path không được để trống!");
    }

    if(
        (await ItemImage.select(
            { $and: [ {itemId: itemId}, {path: path}]}   
        )).length > 0
    ) {
        throw(`Đã tồn tại ItemImage với itemId là ${itemId} và path là ${path}`);
    }

    await ItemImage.insert(path,itemId);
}