import settings from './settings.json';
import express, { Express } from 'express';
import objectsDeclaration from './system/ObjectsDeclaration';
import ObjectsContainer from './system/ObjectsContainer';
import RestfulApisLoader from './system/RestfulApisLoader';
import RestfulApi from './boundary/base_classes/RestfulApi';
import cookieParser = require('cookie-parser');

// Main function
async function main() {
    // App initialization
    const app: Express = express();

    // Include cookie parser into app
    app.use(cookieParser());

    // Start listening
    const server = app.listen(settings.port);

    // Load objects from objects declaration
    const objectsContainer: ObjectsContainer = new ObjectsContainer();
    try {
        await objectsContainer.load(objectsDeclaration);
    }
    catch (error: any) {
        // Error occurred while loading objects from objects declaration
        // Stop server
        server.close();

        // Error logging
        console.error(error);

        // Exit main function
        return;
    }

    // Get RestfulApis from objects loadded
    const restfulApisLoader: RestfulApisLoader = new RestfulApisLoader();
    const restfulApis: RestfulApi[] = restfulApisLoader.loadRestfulApis(objectsContainer);

    // Registering restfulApis with app
    for (const restfulApi of restfulApis) {
        // GET method
        app.get(
            restfulApi.getPath(),
            async function (request, response) {
                await restfulApi.get(request, response);
            }
        )

        // POST method
        app.post(
            restfulApi.getPath(),
            async function (request, response) {
                await restfulApi.post(request, response);
            }
        );

        // PUT method
        app.put(
            restfulApi.getPath(),
            async function (request, response) {
                await restfulApi.put(request, response);
            }
        );

        // DELETE method
        app.delete(
            restfulApi.getPath(),
            async function (request, response) {
                await restfulApi.del(request, response);
            }
        );
    }

    // Notification
    console.log(
        `${settings.name} launched on port ${settings.port}!`
    )
}

// Execution of main function
main()
.catch(
    function (error: any) {
        console.error(error);
    }
)