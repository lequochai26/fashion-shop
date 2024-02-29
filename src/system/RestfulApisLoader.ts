import RestfulApi from "../boundary/base_classes/RestfulApi";
import ObjectsContainer from "./ObjectsContainer";

export default class RestfulApisLoader {
    // Constructor:
    public constructor() {

    }

    // Methods:
    public loadRestfulApis(objectsContainer: ObjectsContainer): RestfulApi[] {
        // Retrieve all objects from objects container and filtering
        const all: RestfulApi[] = objectsContainer
        .retrieveAll()
        .filter(
            function (target) {
                if (target instanceof RestfulApi) {
                    return target;
                }
            }
        );

        // Return all
        return all;
    }
}