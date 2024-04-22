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

async function main() {
    await insertOrder();
}

main()
.then(
    () => console.log("DONE")
)
.catch(
    console.error
)