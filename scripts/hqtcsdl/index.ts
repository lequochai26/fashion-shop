import Order from "./collections/Order";

async function insertOrder() {
    await Order.insert(
        "1713126061093",
        "SELL",
        new Date(),
        1000,
        "APPROVEMENT_AWAITING",
        "ETH"
    );
}

async function selectAllOrders() {
    console.log(
        await Order.select(
            (doc: any) => doc.type === 'SELL'
        )
    );
}

async function main() {
    await selectAllOrders();
}

main()
.then(
    () => console.log("DONE")
)
.catch(
    console.error
)