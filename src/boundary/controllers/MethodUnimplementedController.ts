import RestfulController from "./abstracts/RestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";

export default class MethodUnimplementedController extends RestfulController {
    // Constructor:
    public constructor() {
        super();
    }

    // Methods:
    public async execute({ response }: RestfulControllerParam): Promise<void> {
        response.json(
            {
                success: false,
                message: "Method unimplemented!"
            }
        );
    }
}