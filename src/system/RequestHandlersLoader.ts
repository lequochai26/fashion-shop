import DefaultRequestHandler from "../boundary/base_classes/DefaultRequestHandler";
import RequestHandler from "../boundary/interfaces/RequestHandler";
import ObjectsContainer from "./ObjectsContainer";

export default class RequestHandlersLoader {
    // Constructor:
    public constructor() {

    }

    // Methods:
    public loadRequestHandlers(objectsContainer: ObjectsContainer): RequestHandler[] {
        // Retrieve all objects from objects container and filtering
        const all: RequestHandler[] = objectsContainer
        .retrieveAll()
        .filter(
            function (target) {
                if (target instanceof DefaultRequestHandler) {
                    return target;
                }
            }
        );

        // Return all
        return all;
    }
}