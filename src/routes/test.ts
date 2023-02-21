import { PgDBContext } from "@multiple-transaction-manager/pg";
import express, { NextFunction, Request, response, Response, Router } from "express";
import { FunctionContext, MultiTxnMngr, Task, CondTask, CondTaskRet } from "multiple-transaction-manager";
import CustomClient from "../service/apiClients";
import rh from "../service/routeHelper";

const router: Router = express.Router();

/**
 * @swagger
 * /test/testapi:
 *   post:
 *     description: Echo Test
 *     produces:
 *      - application/json
 *     requestBody:
 *       description: JSON Request contains the items as in the example
 *       required: true
 *       content:
 *          application/json:
 *              schema:
 *                  type: string
 *                  example: {
 *                              "action":"config|data"
 *                           }
 *     responses:
 *       200:
 *         description: Device config
 */
router.post('/testapi', rh.secure, (req: Request, res: Response, next: NextFunction) => {
    if (req.body.action === "config")
        res.redirect("../testfiles/config.json");
    else if (req.body.action === "data")
        res.redirect("../testfiles/data.json");
    else
        next("Unknown action")
});

export default router;