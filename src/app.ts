import * as express from 'express';
import * as BodyParser from 'body-parser';
import { OAuthRoutes } from './routes/OAuthRoutes';
import { APIRoutes } from './routes/APIRoutes';

class App {

    public app: express.Application;
    public OAuthRoutes: OAuthRoutes = new OAuthRoutes();
    public APIRoutes: APIRoutes = new APIRoutes();
    
    constructor() {
        this.app = express()
        this.config();
        this.OAuthRoutes.routes(this.app);
        this.APIRoutes.routes(this.app);
    }

    private config = () => {
        this.app.use(BodyParser.json());
        this.app.use(express.static(__dirname));
    }

}

export default new App().app;