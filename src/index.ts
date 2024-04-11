import settings from './settings.json';
import express, { Express } from 'express';
import objectsDeclaration from './system/ObjectsDeclaration';
import ObjectsContainer from './system/ObjectsContainer';
import RequestHandlersLoader from './system/RequestHandlersLoader';
import cookieParser = require('cookie-parser');
import multer = require('multer');
import RequestHandler from './boundary/interfaces/RequestHandler';
import AdvancedObjectsContainer from './system/AdvancedObjectsContainer';
import SessionFactory from './utils/interfaces/SessionFactory';
import SimpleSessionFactory from './utils/SimpleSessionFactory';
import RestfulControllerRequestDispatcher from './boundary/RestfulControllerRequestDispatcher';
import RestfulControllerRequestDispatcherImpl from './boundary/RestfulControllerRequestDispatcherImpl';

// Main function
async function main() {
    // App initialization
    const app: Express = express();

    // Include cookie parser into app
    app.use(cookieParser());

    // Include json body parser into app
    app.use(express.json());

    // Add log request handler for app
    app.use(
        function (request, response, next) {
            console.log(
                `${request.method}: ${request.path}`
            )

            next();
        }
    );

    // Including multer into app
    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });

    // Start listening
    const server = app.listen(settings.port);

    // Static content
    app.use('/assets', express.static("./assets"));

    // Load objects from objects declaration
    const objectsContainer: ObjectsContainer = new AdvancedObjectsContainer();
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

    // Session factory
    const sessionFactory: SessionFactory = new SimpleSessionFactory();
    sessionFactory.apply(app);

    // RESTful Controller request dispatcher
    const restfulControllerRequestDispatcher: RestfulControllerRequestDispatcher = new RestfulControllerRequestDispatcherImpl();

    restfulControllerRequestDispatcher.apply(app);

    // Get Request Handlers from objects container
    const requestHandlersLoader: RequestHandlersLoader = new RequestHandlersLoader();
    const requestHandlers: RequestHandler[] = requestHandlersLoader.loadRequestHandlers(objectsContainer);

    // Registering restfulApis with app
    for (const requestHandler of requestHandlers) {
        // GET method
        app.get(
            requestHandler.getPath(),
            upload.any(),
            async function (request, response) {
                await requestHandler.get(request, response);
            }
        )

        // POST method
        app.post(
            requestHandler.getPath(),
            upload.any(),
            async function (request, response) {
                await requestHandler.post(request, response);
            }
        );

        // PUT method
        app.put(
            requestHandler.getPath(),
            upload.any(),
            async function (request, response) {
                await requestHandler.put(request, response);
            }
        );

        // DELETE method
        app.delete(
            requestHandler.getPath(),
            upload.any(),
            async function (request, response) {
                await requestHandler.delete(request, response);
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