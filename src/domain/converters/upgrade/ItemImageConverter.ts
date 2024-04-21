import ItemImageData from "../../../persistence/data/ItemImageData";
import AsyncReversableConverter from "../../../utils/interfaces/AsyncReversableConverter";
import Item from "../../entities/upgrade/Item";
import ItemImage from "../../entities/upgrade/ItemImage";

export default class ItemImageConverter implements AsyncReversableConverter<ItemImageData, ItemImage>{

    //Fields 


    //Constructor


    //Methods


    public async convert(from: ItemImageData): Promise<ItemImage> {
       const itemImage = new ItemImage;

       const item: Item = new Item(); //Có trong ItemImage ở Converter DomainLayer
       (item as any).fromConverter = true;
       item.Id = from.itemId; // Khoá chính

       itemImage.Item = item;
       itemImage.Path = from.path;

       return itemImage;
    }

    //reverse
    public async reverse(from: ItemImage): Promise<ItemImageData> {
       return{
        itemId: (await from.getItem())?.Id as string,
        path: from.Path as string,
       }
    }

}