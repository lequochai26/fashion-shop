import ItemImageData from "../../persistence/data/ItemImageData";
import ReversableConverter from "../../utils/interfaces/ReversableConverter";
import Item from "../entities/Item";
import ItemImage from "../entities/ItemImage";

export default class ItemImageConverter implements ReversableConverter<ItemImageData, ItemImage>{

    //Fields 


    //Constructor


    //Methods


    public convert(from: ItemImageData): ItemImage {
       const itemImage = new ItemImage;

       const item: Item = new Item(); //Có trong ItemImage ở Converter DomainLayer
       item.Id = from.itemId; // Khoá chính

       itemImage.Item = item;
       itemImage.Path = from.path;

       return itemImage;
    }

    //reverse
    public reverse(from: ItemImage): ItemImageData {
       return{
        itemId: from.Item?.Id as string,
        path: from.Path as string,
       }
    }

}