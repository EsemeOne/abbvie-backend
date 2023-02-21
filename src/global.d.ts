import { Logger } from "log4js";
import { Pool } from "pg";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      HTTP_PORT: any;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_DATABASE: string;
      DB_HOST: string;
      DB_PORT: any;
      SEB_SECRET: string;
      SEB_JWT_EXPIRES_IN: string;
      SEB_SALT_ROUNDS: any;
      SEB_EMAIL_SYSTEM: string;
      SEB_EMAIL_USER: string;
      SEB_EMAIL_PASSWORD: string;
    }
  }

  var as: any;
  var logger: Logger;
  
  namespace Express {
    export interface Request {
      claim: any;
      user: any;
      calledRoute: any;
    }
  }

}
export { }