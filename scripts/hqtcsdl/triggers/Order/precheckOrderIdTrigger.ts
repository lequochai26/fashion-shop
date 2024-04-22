import Order from "../../collections/Order";
import connect from "../../Connector";
import Trigger from "../../types/Trigger";

const precheckOrderIdTrigger: Trigger = {
    type: "insteadOf",
    async callback(inserted) {
        const { connection, collection } = await connect(Order.collectionName);

        if (await collection.findOne({ id: inserted.id })) {
            await connection.close();
            throw new Error(`Đơn hàng với mã '${inserted.id}' đã tồn tại!`);
        }

        await connection.close();
    },
}

export default precheckOrderIdTrigger;