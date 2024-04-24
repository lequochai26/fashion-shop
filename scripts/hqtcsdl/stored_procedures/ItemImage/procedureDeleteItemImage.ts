import ItemImage from "../../collections/ItemImage";

export default async function procedureDeleteItemImage(path: string, itemId: string) {

    try {
        // Gọi hàm delete từ class ItemImage để xóa ItemImage có đường dẫn và itemId tương ứng
        await ItemImage.delete(path, itemId);
        console.log(`ItemImage with path ${path} and itemId ${itemId} has been deleted successfully.`);
    } catch (error) {
        console.error("Error deleting ItemImage",error);
    }
}

//Cách test

// import procedureDeleteItemImage from "./stored_procedures/ItemImage/procedureDeleteItemImage"; // Import hàm procedureDeleteItemImage từ đúng đường dẫn

// // Định nghĩa các tham số cần thiết
// const pathToDelete = "/assets/itemImages/d77e7ee70ebb9ee2c389e4f43051312afd6f39e20ddabc8e6ba482b051554354.jpg";
// const itemIdToDelete = "SHOES002";

// // Gọi hàm procedureDeleteItemImage với các tham số đã định nghĩa
// procedureDeleteItemImage(pathToDelete, itemIdToDelete)
//     .then(() => {
//         console.log(`ItemImage with path ${pathToDelete} and itemId ${itemIdToDelete} has been deleted successfully.`);
//     })
//     .catch((error) => {
//         console.error("Error deleting ItemImage:", error);
//     });
