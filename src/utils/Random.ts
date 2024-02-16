// Constants:
const stringRandomData = {
    from: 48,
    to: 122,
    excepts: [
        {from: 58, to: 64},
        {from: 91, to: 96}
    ]
}

/**
 * Tạo ra một số ngẫu nhiên trong phạm vi được chỉ định
 * @param from Bắt đầu của phạm vi
 * @param to Kết thúc của phạm vi
 * @returns Số ngẫu nhiên trong phạm vi từ from đến to.
 */
export function randomNumberBetween(from: number, to: number): number {
    if (from >= to) {
        throw new Error("from must lower than to!");
    }

    to++;

    return (from + Math.floor(Math.random() * (to - from)));
}

/**
 * Tạo ra một chuỗi ngẫu nhiên với N ký tự.
 * @param num Số ký tự
 * @returns Chuỗi ngẫu nhiên có N ký tự
 */
export function randomString(num: number): string {
    // Destructoring
    const { from, to, excepts } = stringRandomData;

    // Result definition
    let result: string = "";

    // Generating
    for (let i = 1; i<=num; i++) {
        // Generate random char code
        let charCode: number = 0;

        // Genrating random charCode
        while (true) {
            charCode = randomNumberBetween(from, to);

            let take: boolean = true;

            for (const except of excepts) {
                if (charCode >= except.from && charCode <= except.to) {
                    take = false;
                    break;
                }
            }

            if (take) {
                break;
            }
        }

        // Convert charCode to char
        const char: string = String.fromCharCode(charCode);

        // Concat char to result
        result += char;
    }

    // Return result
    return result;
}