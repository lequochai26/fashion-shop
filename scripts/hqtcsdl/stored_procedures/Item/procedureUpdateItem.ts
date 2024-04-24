import Item from "../../collections/Item";

export default async function procedureUpdateItem(
    id: string,
    name: string,
    description: string,
    price: number,
    buyPrice: number,
    amount: number,
    gender: boolean,
    avatar: string | undefined,
    metadata?: string | undefined,
    type?: string | undefined,
    brand?: string | undefined
): Promise<void> {
    try {
        if (!(await Item.select({ id }))) {
            throw new Error(`Sản phẩm có mã ${id} không tồn tại!`);
        }
        await Item.update(id, avatar, name, description, price, buyPrice, amount, gender, metadata, type, brand);
    } catch (error: any) {
        console.error("Lỗi khi cập nhật mã:", error);
    }

    try {
        if (!(await Item.select({ name }))) {
            await Item.update(id, avatar, name, description, price, buyPrice, amount, gender, metadata, type, brand);
        }
    } catch (error: any) {
        console.error("Lỗi khi cập nhật tên:", error);
    }

    try {
        if (!(await Item.select({ description }))) {
            await Item.update(id, avatar, name, description, price, buyPrice, amount, gender, metadata, type, brand);
        }
    } catch (error: any) {
        console.error("Lỗi khi cập nhật mô tả:", error);
    }

    try {
        if (!(await Item.select({ price }))) {
            await Item.update(id, avatar, name, description, price, buyPrice, amount, gender, metadata, type, brand);
        }
    } catch (error: any) {
        console.error("Lỗi khi cập nhật giá bán:", error);
    }

    try {
        if (!(await Item.select({ buyPrice }))) {
            await Item.update(id, avatar, name, description, price, buyPrice, amount, gender, metadata, type, brand);
        }
    } catch (error: any) {
        console.error("Lỗi khi cập nhật giá mua lại:", error);
    }

    try {
        if (!(await Item.select({ amount }))) {
            await Item.update(id, avatar, name, description, price, buyPrice, amount, gender, metadata, type, brand);
        }
    } catch (error: any) {
        console.error("Lỗi khi cập nhật số lượng:", error);
    }

    try {
        if (!(await Item.select({ gender }))) {
            await Item.update(id, avatar, name, description, price, buyPrice, amount, gender, metadata, type, brand);
        }
    } catch (error: any) {
        console.error("Lỗi khi cập nhật giới tính:", error);
    }

    try {
        if (!(await Item.select({ avatar }))) {
            await Item.update(id, avatar, name, description, price, buyPrice, amount, gender, metadata, type, brand);
        }
    } catch (error: any) {
        console.error("Lỗi khi cập nhật ảnh đại diện:", error);
    }

    try {
        if (!(await Item.select({ metadata }))) {
            await Item.update(id, avatar, name, description, price, buyPrice, amount, gender, metadata, type, brand);
        }
    } catch (error: any) {
        console.error("Lỗi khi cập nhật metada:", error);
    }

    try {
        if (!(await Item.select({ type }))) {
            await Item.update(id, avatar, name, description, price, buyPrice, amount, gender, metadata, type, brand);
        }
    } catch (error: any) {
        console.error("Lỗi khi cập nhật loại:", error);
    }

    try {
        if (
            !(await Item.select({ brand }))
        ) {
            await Item.update(id, avatar, name, description, price, buyPrice, amount, gender, metadata, type, brand);
        }
    } catch (error: any) {
        console.error("Lỗi khi cập nhật thương hiệu:", error);
    }

}
