import Brand from "../../collections/Brand";

export default async function procedureGetBrandsByKeyword(keyword: string): Promise<any> {
    if(!keyword) {
        throw new Error("Chưa cung cấp từ khoá tìm kiếm!");
    }

    return Brand.select(
        (brand: any) => (`${brand.id} ${brand.name}`.toLowerCase().includes(keyword.toLowerCase()))
    );
}