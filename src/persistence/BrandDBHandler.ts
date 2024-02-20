import { Document, WithId } from "mongodb";
import DBHandler from "./DBHandler";
import BrandDataConverter from "./converters/BrandDateConverter";
import BrandData from "./data/BrandData";
import { get, getAll, getByFilter, insert, remove, update } from "./Connector";

export default class BrandDataDBHandler implements DBHandler<BrandData,string>{
    //static fileds các biến được khai báo với từ khóa static trong một lớp. Static fields chỉ có một bản sao duy nhất trong bộ nhớ 
    //và được chia sẻ bởi tất cả các đối tượng của lớp đó
    private static brandData: string = "BrandData";
    //fields
    private brandDataConverter: BrandDataConverter;
    //constructor
    public constructor(brandDataConverter: BrandDataConverter){
        this.brandDataConverter = brandDataConverter;
    }
    public async get(pKey: string): Promise<BrandData | undefined> {
        //lấy document đầu tiên khớp với pKey (dùng filter) trong db.
        const documentBrand: WithId<Document> | null = await get(
            BrandDataDBHandler.brandData,pKey
        );
        //ko co thi return underfined
        if(!documentBrand){
            return;
        }
        //tim document phu hop voi pkey(dung filter)
        //chuyen document sang DTO
        const brandData: BrandData = this.brandDataConverter.convert(documentBrand);
        //return, ben day chi viec goi ben Converter
        return brandData;
    }
    public async getAll(): Promise<BrandData[]> {
        const documentBrands: WithId<Document>[] = await getAll(
            BrandDataDBHandler.brandData
        );
         //tao ra 1 list chua dto,dcument la du lieu tho
        const brandList: BrandData[]=[];
        //chuyen doi document sang dữ liệu DTO và thêm vào list
        for(const documentBrand of documentBrands){
            //cd
            const brandData: BrandData = this.brandDataConverter.convert(documentBrand);
            //add
            brandList.push(brandData);
        }
        return brandList;
    }
    public async getByFilter(filter: any): Promise<BrandData[]> {
        const documentBrands: WithId<Document>[] = await getByFilter(
            BrandDataDBHandler.brandData,filter
        );
         //tao ra 1 list chua dto,dcument la du lieu tho
        const brandList: BrandData[]=[];
        //chuyen doi document sang dữ liệu DTO và thêm vào list
        for(const documentBrand of documentBrands){
            //cd
            const brandData: BrandData = this.brandDataConverter.convert(documentBrand);
            //add
            brandList.push(brandData);
        }
        return brandList;
    }
    public async insert(target: BrandData): Promise<void> {
        //add, sau khi add thi thoat ra
       return insert(BrandDataDBHandler.brandData,target);
    }
    public async update(target: BrandData): Promise<void> {
        //Tạo primary cho target(dùng filter để cập nhật document)
        const pKeyBrand = { id: target.id };
        return update(BrandDataDBHandler.brandData,target,pKeyBrand);
    }
    public async remove(target: BrandData): Promise<void> {
        return this.removeByPrimaryKey(target.id);
    }
    public async removeByPrimaryKey(pKey: string): Promise<void> {
        //xoa document khớp với primary key
        const primaryKey  = {
            id : pKey,
       };
      return remove(BrandDataDBHandler.brandData,primaryKey);
    }
    
}