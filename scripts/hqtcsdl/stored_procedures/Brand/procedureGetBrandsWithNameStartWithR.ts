import Brand from "../../collections/Brand";

export default async function procedureGetBrandsWithNameStartWithR(): Promise<any> {
    return Brand.select(
        (brand: any) => (brand.name as string).toLowerCase().startsWith("r")
    )
}