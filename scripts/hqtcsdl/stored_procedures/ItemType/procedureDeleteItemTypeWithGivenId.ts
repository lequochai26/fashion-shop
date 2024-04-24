import ItemType from "../../collections/ItemType";
export default async function procedureDeleteItemTypeWithGivenId(id: string) {

    try {
        if ((await ItemType.select({ id })).length === 0) {
            throw new Error(`Không tồn tại sản phẩm với mã ${id}`)
        }
        await ItemType.delete(id);
    } catch (error: any) {
        console.error("Lỗi khi xóa ", error);
    }
}
// Cách test
// import procedureDeleteItemTypeWithGivenId from "./stored_procedures/ItemType/procedureDeleteItemTypeWithGivenId";

// // Assuming you have an id to pass to the function
// const idToDelete = "FASHION_SET";

// // Call the function with the id
// procedureDeleteItemTypeWithGivenId(idToDelete)
//   .then(() => {
//     console.log("Item type deleted successfully.");
//   })
//   .catch((error) => {
//     console.error("Error deleting item type:", error);
//   });
