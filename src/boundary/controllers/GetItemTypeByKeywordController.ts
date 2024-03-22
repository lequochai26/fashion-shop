import QueryItemTypeRestfulController from "./abstracts/QueryItemTypeRestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";

export default class GetItemTypeByKeywordController extends QueryItemTypeRestfulController {
    public execute(param: RestfulControllerParam): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
}