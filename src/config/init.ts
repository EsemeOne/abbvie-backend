import { ExpressOIDC } from "@okta/oidc-middleware";
import cors from "cors";
import * as dotenv from "dotenv";
import { Express, json } from "express";
import session from "express-session";
import log4js from "log4js";
import morgan from "morgan";
import { Pool } from "pg";
import seb from "serial-entrepreneur-backend";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

/*
* Init the system
*/
export default async (app: Express) => {

    //init environment
    dotenv.config({ path: `.${process.env.NODE_ENV}.env` })

    // init global scope
    global.as = {};
    require("../config/appscope");
    require("../config/sqls");

    // init logger
    log4js.configure({
        appenders: { 'out': { type: 'console' } },
        categories: {
            default: { appenders: ['out'], level: 'debug' },
            MultiTxnMngr: { appenders: ['out'], level: 'debug' },
            Abbvie: { appenders: ['out'], level: process.env.LOG_LEVEL || 'info' }
        }
    });
    global.logger = log4js.getLogger("Abbvie");


    // init DB
    const dbConfig = {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
    }

    global.pgPool = new Pool(dbConfig);

    //init Express
    app.use(json());
    app.use(morgan('combined'));
    app.use(cors());
    app.options('*', cors());
    //session for okta
    app.use(session({
        secret: process.env.SEB_SECRET,
        resave: true,
        saveUninitialized: false
    }));

    // Init serial entrepreneur backend
    seb.init({
        jwtKeys: {
            secret: process.env.SEB_SECRET,
            jwt_expiresIn: process.env.SEB_JWT_EXPIRES_IN,
        },
        bcryptKeys: {
            saltRounds: parseInt(process.env.SEB_SALT_ROUNDS, 10),
        },
        emailKeys: {
            use: process.env.SEB_EMAIL_SYSTEM,
            credentials: {
                user: process.env.SEB_EMAIL_USER,
                app_password: process.env.SEB_EMAIL_PASSWORD,
            },
        },
        pgKeys: dbConfig,
        applicationName: process.env.SEB_APP_NAME
    });

    //init swagger
    const swaggerOptions = swaggerJsdoc(require('../config/swagger').options);
    app.use('/api-docs', swaggerUi.serveFiles(swaggerOptions));
    app.get('/api-docs', (_, res) => { res.send(swaggerUi.generateHTML(swaggerOptions)); });
    app.get('/swagger.json', (_, res) => { res.setHeader('Content-Type', 'application/json'); res.send(swaggerOptions); });
   
    global.logger.debug("Initialization Completed");

}


