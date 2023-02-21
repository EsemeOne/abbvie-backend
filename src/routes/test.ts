import { PgDBContext } from "@multiple-transaction-manager/pg";
import express, { NextFunction, Request, Response, Router } from "express";
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
 *                              "something":"something else"
 *                           }
 *     responses:
 *       200:
 *         description: Device config
 */
router.post('/testapi', rh.secure, (req: Request, res: Response, next: NextFunction) => {
    rh.resp(res, global.as.HTTP_STATUS_CODES.OK, req.body);
});

export default router;