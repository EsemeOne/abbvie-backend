import { PgDBContext } from "@multiple-transaction-manager/pg";
import express, { NextFunction, Request, Response, Router } from "express";
import { MultiTxnMngr } from "multiple-transaction-manager";
import rh from "../service/routeHelper";

const router: Router = express.Router();

/**
 * @swagger
 * /role/get-roles:
 *   post:
 *     description: Gets roles
 *     requestBody:
 *       description: JSON Request contains the items as in the example
 *       required: true
 *       content:
 *          application/json:
 *              schema:
 *                  type: string
 *                  example: {
 *                           }
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: The list of roles
 */
router.post('/get-roles', rh.secure, (req: Request, res: Response, next: NextFunction) => {
    const txn: MultiTxnMngr = new MultiTxnMngr();
    const pgContext = new PgDBContext(txn, global.pgPool);
    const getRoles = pgContext.addTask(global.as.SQL.GET_ROLES);

    txn.exec().then(_ => {
        if (global.as.isEmpty(getRoles.getResult().rows)) {
            rh.resp(res, global.as.HTTP_STATUS_CODES.OK, []);
        } else {
            rh.resp(res, global.as.HTTP_STATUS_CODES.OK, getRoles.getResult().rows);
        }
    }).catch(err => {
        next(err);
    });
});


/**
 * @swagger
 * /role/get-user-role:
 *   post:
 *     description: Gets the roles of a user with user ID or email 
 *     requestBody:
 *       description: JSON Request contains the items as in the example
 *       required: true
 *       content:
 *          application/json:
 *              schema:
 *                  type: string
 *                  example: {
 *                              "userId": 1,
 *                              "email": "admin@admin.com"
 *                           }
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Success message
 */
router.post('/get-user-role', rh.secure, async (req: Request, res: Response, next: NextFunction) => {

    let userId = req.body.userId;
    if (!userId && req.body.email) {
        userId = await getUserIdFromEmail(req.body.email);
    }
    if (!userId) {
        next("Unknown userId or email");
        return;
    }
    const txn: MultiTxnMngr = new MultiTxnMngr();
    const pgContext = new PgDBContext(txn, global.pgPool);
    const getRoles = pgContext.addTask(global.as.SQL.GET_USER_ROLES, { userId: userId });

    txn.exec().then(_ => {
        if (global.as.isEmpty(getRoles.getResult().rows)) {
            next("Unknown userId or email or no roles assigned!");
        } else {
            rh.resp(res, global.as.HTTP_STATUS_CODES.OK, getRoles.getResult().rows);
        }
    }).catch(err => {
        next(err);
    });
});

/**
 * @swagger
 * /role/set-user-role:
 *   post:
 *     description: Updates the roles of a user by user ID or email
 *     requestBody:
 *       description: JSON Request contains the items as in the example
 *       required: true
 *       content:
 *          application/json:
 *              schema:
 *                  type: string
 *                  example: {
 *                              "userId": 1,
 *                              "email": "admin@admin.com",
 *                              "roleCode": "SuperUser"
 *                           }
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Success message
 */
router.post('/set-user-role', rh.secure, async (req: Request, res: Response, next: NextFunction) => {

    let userId = req.body.userId;
    const roleCodes = [req.body.roleCode]; // KEMAL: multiple roles in the future maybe...

    //TODO: Admin check

    if (!userId && req.body.email) {
        userId = await getUserIdFromEmail(req.body.email);
    }
    if (!userId) {
        next("Unknown userId or email");
        return;
    }

    const txn: MultiTxnMngr = new MultiTxnMngr();
    const pgContext = new PgDBContext(txn, global.pgPool);

    pgContext.addTask(global.as.SQL.DELETE_USER_ROLES, { userId: userId });
    const sql: string[] = [];
    let paramObj = { userId };
    roleCodes.forEach((roleCode: number, idx: number) => {
        paramObj["roleCode" + idx] = roleCode;
        sql.push("(:userId, :roleCode" + idx + ")");
    });
    pgContext.addTask(global.as.SQL.INSERT_USER_ROLES + " " + sql.join(","), paramObj);
    txn.exec().then(_ => {
        rh.resp(res, global.as.HTTP_STATUS_CODES.OK, "User roles updated.");
    }).catch(err => {
        next(err);
    });
});

async function getUserIdFromEmail(email: string): Promise<string | undefined> {
    // Should be in SEB ?? Therefore SQL is written here
    return new Promise<string | undefined>((resolve, _) => {
        const txn: MultiTxnMngr = new MultiTxnMngr();
        const pgContext = new PgDBContext(txn, global.pgPool);
        const userTask = pgContext.addTask("Select id from serialentrepreneur.users where email = :email", { email });
        txn.exec().then(_ => {
            resolve(userTask.getResult().rows[0]["id"]);
        }).catch(err => {
            global.logger.warn("getUserIdFromEmail failed. " + err);
            resolve(undefined);
        });
    });
}

export default router;