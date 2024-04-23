import Brand from "../../collections/Brand";

export default async function functionGetBrandBaseOnGivenId(id:string):Promise<any> {
    const brands = await Brand.select({id});

    return brands;
}