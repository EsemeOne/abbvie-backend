import { PgDBContext } from "@multiple-transaction-manager/pg";
import express, { NextFunction, Request, Response, Router } from "express";
import { MultiTxnMngr } from "multiple-transaction-manager";
import seb from "serial-entrepreneur-backend";
import CustomClient from "../service/apiClients";
import rh from "../service/routeHelper";

const router: Router = express.Router();

/**
 * @swagger
 * /seb/me:
 *   post:
 *     description: Gets user info
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
 *         description: User Info
 */
router.post('/me', rh.secure, async (req: Request, res: Response, next: NextFunction) => {
    rh.resp(res, global.as.HTTP_STATUS_CODES.OK, req.user);
});

/**
 * @swagger
 * /seb/loginuserviamail:
 *   post:
 *     description: Gets user info
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: User Info
 */
router.post('/loginuserviamail', rh.insecure, async (req: Request, res: Response, next: NextFunction) => { callHandler(req, res, next, 'loginUserViaMail', ['email', 'password']) });

/**
 * @swagger
 * /seb/registeruserstep1:
 *   post:
 *     description: Initial user registration
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - middleName
 *               - lastName
 *               - birthDate
 *               - gender
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               middleName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               birthDate:
 *                 type: date
 *                 pattern: /([0-9]{4})-(?:[0-9]{2})-([0-9]{2})/
 *                 example: "2000-01-21"
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: registeruserstep1
 */
router.post('/registeruserstep1', rh.insecure, async (req: Request, res: Response, next: NextFunction) => { callHandler(req, res, next, 'registerUserStep1', ['name', 'middleName', 'lastName', 'email', 'password', 'birthDate', 'gender']) });

/**
 * @swagger
 * /seb/registeruserstep2:
 *   post:
 *     description: Register user with the confirmation code sent by email
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - confirmationCode
 *             properties:
 *               email:
 *                 type: string
 *               confirmationCode:
 *                 type: string
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: registeruserstep2
 */
router.post('/registeruserstep2', rh.insecure, async (req: Request, res: Response, next: NextFunction) => {
    callHandler(req, res, next, 'registerUserStep2', ['email', 'confirmationCode'], async (result: any) => {
        const ret = await seb.getUserData(result)
        const userId = ret.rows[0].id;

        const txn: MultiTxnMngr = new MultiTxnMngr();
        const pgContext = new PgDBContext(txn, global.pgPool);
        pgContext.addTask(global.as.SQL.ADD_USER_ROLE, { userId, roleCode: "None" });
        await txn.exec();
    })
});

/**
 * @swagger
 * /seb/removeuser:
 *   post:
 *     description: Removes user
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - token
 *             properties:
 *               email:
 *                 type: string
 *               token:
 *                 type: string
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: removeuser
 */
router.post('/removeuser', rh.secure, async (req: Request, res: Response, next: NextFunction) => { callHandler(req, res, next, 'removeUser', ['email', 'token']) });


/**
 * @swagger
 * /seb/getuserdata:
 *   post:
 *     description: Gets user info
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: getuserdata
 */
router.post('/getuserdata', rh.secure, async (req: Request, res: Response, next: NextFunction) => { callHandler(req, res, next, 'getUserData', ['token']) });

/**
 * @swagger
 * /seb/changepassword:
 *   post:
 *     description: Change password
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: changepassword
 */
router.post('/changepassword', rh.secure, async (req: Request, res: Response, next: NextFunction) => { callHandler(req, res, next, 'changePassword', ['token', 'oldPassword', 'newPassword']) });

/**
 * @swagger
 * /seb/resetpasswordstep1:
 *   post:
 *     description: Initiate reset password sequence and get the confirmation code via email
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: resetpasswordstep1
 */
router.post('/resetpasswordstep1', rh.insecure, async (req: Request, res: Response, next: NextFunction) => { callHandler(req, res, next, 'resetPasswordStep1', ['email']) });

/**
 * @swagger
 * /seb/resetpasswordstep2:
 *   post:
 *     description: Update password with the confirmation code sent to the email 
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - confirmationCode
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *               confirmationCode:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: resetpasswordstep2
 */
router.post('/resetpasswordstep2', rh.insecure, async (req: Request, res: Response, next: NextFunction) => { callHandler(req, res, next, 'resetPasswordStep2', ['email', 'confirmationCode', 'newPassword']) });

/**
 * @swagger
 * /seb/updateuserdata:
 *   post:
 *     description: Update user data
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - name
 *               - middleName
 *               - lastName
 *               - birthDate
 *               - gender
 *             properties:
 *               token:
 *                 type: string
 *               name:
 *                 type: string
 *               middleName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               birthDate:
 *                 type: date
 *                 pattern: /([0-9]{4})-(?:[0-9]{2})-([0-9]{2})/
 *                 example: "2000-01-21"
 *               gender:
 *                 type: string
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: updateuserdata
 */
router.post('/updateuserdata', rh.secure, async (req: Request, res: Response, next: NextFunction) => {
    callHandler(req, res, next, 'updateUserData', ['token', 'name', 'middleName', 'lastName', 'birthDate', 'gender'])
});


//TODO: swagger
//http://127.0.0.1:3000/seb/testhandler?email=email@email.com&password=password123&name=name123
//router.get('/testhandler', async (req: Request, res: Response, next: NextFunction) => { callHandler(req, res, next, 'testHandler', ['name', 'email', 'password']); });
//router.post('/loginuserviatoken', async (req: Request, res: Response, next: NextFunction) => { callHandler(req, res, next, 'loginUserViaToken', ['token']) });


const callHandler = async (req: Request, res: Response, next: NextFunction, handler: string, paramsArr: string[], execNext?: Function) => {
    const params = ((req.body) && (Object.keys(req.body).length > 0)) ? req.body : req.query;
    try {
        let paramsToSend: any[] = [];
        for (let i = 0; i < paramsArr.length; i++) {
            paramsToSend.push(params[paramsArr[i]]);
        }
        let l_result = await seb[handler](...paramsToSend);
        let l_responseJSON = {
            result: 'OK'
        }
        if (l_result?.payload) (l_responseJSON as any).payload = l_result.payload;
        if (l_result?.rows) (l_responseJSON as any).rows = l_result.rows;
        if (execNext) await execNext(l_result);
        res.status(global.as.HTTP_STATUS_CODES.OK).send(l_responseJSON);
    } catch (error) {
        res.status(global.as.HTTP_STATUS_CODES.UNAUTHORIZED).send(error);
    }
}


async function addSSOUserToSeb(email: string, name: string, lastname: string): Promise<string | undefined> {
    // Should be in SEB ?? Therefore SQL is written here
    return new Promise<string | undefined>((resolve, reject) => {
        const txn: MultiTxnMngr = new MultiTxnMngr();
        const pgContext = new PgDBContext(txn, global.pgPool);
        const userTask = pgContext.addTask("insert into serialentrepreneur.users (name, lastName, email, password) values (:name, :lastname, :email, 'no_such_pwd') RETURNING id",
            { email, name, lastname });
        
        const roleTask = pgContext.addTask(global.as.SQL.ADD_USER_ROLE, ()=>{return  { "userId": userTask.getResult().rows[0].id, roleCode: "None" }});
        txn.exec().then(_ => {
            resolve("OK");
        }).catch(err => {
            global.logger.warn("addSSOUserToSeb failed. " + err);
            reject(err);
        });
    });
}

export default router;