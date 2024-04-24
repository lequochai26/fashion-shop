import Brand from "../../collections/Brand";

export default async function procedureGetBrandsWithNameStartWithR(): Promise<any> {
    return Brand.select(
        (brand: any) => {
            return brand.name[0].toLowerCase() === 'r';
        }
    )
}