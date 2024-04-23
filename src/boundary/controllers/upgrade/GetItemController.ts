import Item from "../../../domain/entities/upgrade/Item";
import DomainManager from "../../../domain/upgrade/DomainManager";
import AsyncConverter from "../../../utils/interfaces/AsyncConverter";
import ItemInfo from "../../infos/item/ItemInfo";
import QueryItemRestfulController from "../abstracts/upgrade/QueryItemRestfulController";
import RestfulControllerParam from "../interfaces/RestfulControllerParam";

export default class GetItemController extends QueryItemRestfulController {

    //Constructor
    public constructor(
        itemInfoConverter: AsyncConverter<Item, ItemInfo>,
        domainManager?: DomainManager | undefined
    ) {
        super(itemInfoConverter, domainManager)
    }

    //Methods

    public async execute({ response, request }: RestfulControllerParam): Promise<void> {
        //
        const id: string | undefined = request.query.id as string;

        if (!id) { // khong tim thay id
            response.json(
                {
                    success: false,
                    message: 'id parameter is required!'
                }
            );
            return;
        }

        //path
        const path: any[] = []

        //Get item using DomainManager
        try {
            var item: Item | undefined =
                await this.useDomainManager( //This = Su dung useDomainManager trong GetItem
                    async function (useDomainManager) {
                        return useDomainManager.getItem(id, path)
                    }
                )
        } catch (error: any) {
            console.log(error);

            //Trong luong catch
            response.json(
                {
                    success: false,
                    message: "Failed while handling with DB!"
                }
            )
            return;
        }

       

        response.json(
            {
                success: true,
                result: item && await this.itemInfoConverter.convert(item)
            }
        )
    }
}