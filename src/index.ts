import express, { Express } from "express";
import https from "https";
import fs from "fs";
import init from "./config/init";
import seb from "./routes/seb";
import role from "./routes/role";
import test from "./routes/test";
import rh from "./service/routeHelper";

const app: Express = express();
init(app).then(() => {
    app.use(express.static('public'));
    app.use("/seb", seb);
    app.use("/role", role);
    app.use("/test", test);
    app.use(rh.errorhandler);

    if (process.env.HTTPS_PORT && process.env.SSL_KEY && process.env.SSL_CERT) {
        const options: any = {
            key: fs.readFileSync(process.env.SSL_KEY),
            cert: fs.readFileSync(process.env.SSL_CERT),
        };
        if (process.env.SSL_CA) {
            options.ca = fs.readFileSync(process.env.SSL_CA);
        }
        https.createServer(options, app).listen(process.env.HTTPS_PORT, () => {
            console.log("HTTPS Server running at http://127.0.0.1:" + process.env.HTTPS_PORT);
        })
    } 
    if (process.env.HTTP_PORT) {
        app.listen(process.env.HTTP_PORT, () => { console.log("HTTP Server running at http://127.0.0.1:" + process.env.HTTP_PORT) });
    }

}).catch((err) => {
    console.log(err);
    console.log("Unfortunately quitting...");
});
