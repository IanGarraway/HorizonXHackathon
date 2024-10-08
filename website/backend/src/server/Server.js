import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';



export default class Server{
    #app;
    #host;
    #port;
    #adminRouter;
    #accountRouter;
    #dataRouter;
    #server;
    #allowedOrigin
    
    
    constructor(port, host, accountRoutes, adminRoutes, dataRoutes, allowedOrigin) {
        this.#app = express();
        this.#port = port;
        this.#host = host;
        this.#server = null;
        this.#adminRouter = adminRoutes;
        this.#accountRouter = accountRoutes;
        this.#dataRouter = dataRoutes;
        this.#allowedOrigin = allowedOrigin;
        
    }

    getApp = () => {
        return this.#app;
    }

    start = () => {
        
        const corsOptions = {
            origin: this.#allowedOrigin, //allow only the react front end to be the origin
            credentials: true, //allow for the use of the auth tokens
            methods: ['GET', 'POST', 'PATCH'], //allowed methods
            allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'x-access-token'], //allowed headers
        };

        this.#app.use(cors(corsOptions));
        this.#app.use(express.json());
        this.#app.use(cookieParser());
        
        this.#app.use(
            this.#accountRouter.getRouteStartPoint(),
            this.#accountRouter.getRouter()
        );
        this.#app.use(
            this.#adminRouter.getRouteStartPoint(),
            this.#adminRouter.getRouter()
        );
        this.#app.use(
            this.#dataRouter.getRouteStartPoint(),
            this.#dataRouter.getRouter()
        );

        this.#server = this.#app.listen(this.#port, this.#host, () => {
            console.log(`Server is listening on http://${this.#host}:${this.#port}`);
        });
    };

    close = () => {
        this.#server.close();
    }
}