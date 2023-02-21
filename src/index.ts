import express, { Express } from "express";
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
    app.listen(process.env.HTTP_PORT, () => { console.log("Server running at http://127.0.0.1:" + process.env.HTTP_PORT) });
}).catch((err) => {
    console.log(err);
    console.log("Unfortunately quitting...");
});
