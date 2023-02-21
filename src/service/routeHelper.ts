import { PgDBContext } from "@multiple-transaction-manager/pg";
import { NextFunction, Request, Response } from "express";
import { FunctionContext, MultiTxnMngr, Task } from "multiple-transaction-manager";
import * as seb from "serial-entrepreneur-backend";

const RouteHelper = {

    getClaim: async function (req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) {
            RouteHelper.resp(res, global.as.HTTP_STATUS_CODES.UNAUTHORIZED, "Auth token does not exist.");
        } else {
            try {
                req.claim = seb.jwtDecode(token);
                req.claim.token = token;
                next();
            } catch (err) {
                next(err);
            };
        }
    },

    getUser: async function (req: Request, res: Response, next: NextFunction) {
        try {
            //TODO: duplicate token decode
            const users = await seb.getUserData(req.claim.token);
            req.user = users.rows[0];
            delete req.user.password;
            next();
        } catch (err) {
            next(err);
        };
    },

    logReq: async function (req: Request, res: Response, next: NextFunction) {
        try {
            const calledPath = req.baseUrl + req.path;
            req.calledRoute = Object.values(global.as.routeCodes).find((x: any) =>
                (x.routes && x.routes.includes(calledPath)) || (x.route === calledPath));
            if (!req.calledRoute) {
                next("Unknown route!");
            }
            if (global.as.isEmpty(req) || global.as.isEmpty(req.user)) {
                RouteHelper.resp(res, global.as.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, "User info not found.");
            } else {
                const txn: MultiTxnMngr = new MultiTxnMngr();
                const pgContext = new PgDBContext(txn, global.pgPool);
                pgContext.addTask(global.as.SQL.INSERT_USER_AUDIT_LOG,
                    { "userId": req.user.id, "calledService": req.calledRoute.code + " - " + calledPath, "parameters": JSON.stringify({ body: req.body, ip: req.connection.remoteAddress, ...req.headers }) });
                txn.exec().then(_ => {
                    next();
                }).catch(err => {
                    global.logger.debug("Log Req Failed. Error:" + err);
                    next(err);
                });
            }
        } catch (err) {
            next(err);
        }
    },

    checkAuthorization: async function (req: Request, res: Response, next: NextFunction) {
        if (global.as.isEmpty(req) || global.as.isEmpty(req.user)) {
            RouteHelper.resp(res, global.as.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, "User info not found.");
        } else {
            const txn: MultiTxnMngr = new MultiTxnMngr();
            const funcCtx: FunctionContext = new FunctionContext(txn);
            const pgContext = new PgDBContext(txn, global.pgPool);
            const getUserRoles: Task = pgContext.addTask(global.as.SQL.GET_USER_ROLES, { "userId": req.user.id });
            const getRoleScreenObjects: Task = pgContext.addTask(global.as.SQL.GET_ROLE_SCREEN_OBJECTS,
                () => {
                    return {
                        "roleCodes": [0, ...getUserRoles.getResult().rows.flatMap(x => x["role_code"])]
                    }
                });
            funcCtx.addTask(
                (task) => {
                    return new Promise((resolve, reject) => {
                        req.user.roles = getUserRoles.getResult().rows.flatMap(x => x["role_code"]);
                        req.user.allowedRoutes = getRoleScreenObjects.getResult().rows.flatMap(row =>
                            Object.values(global.as.routeCodes).find((x: any) => x.code == row["screen_object_id"])).filter(x => x);

                        //TODO: multiple role support
                        req.user.authorizedScreenObjects = require('../../frontend-authorization/frontend-authorization.js')(req.user.roles[0]);

                        if (req.calledRoute.code != global.as.routeCodes.NO_CHECK.code && !req.user.allowedRoutes.find(x => x.code === req.calledRoute.code)) {
                            global.logger.debug("User authorization failed for " + req.calledRoute.code + " Allowed screen objects: " + JSON.stringify(req.user.allowedRoutes));
                            RouteHelper.resp(res, global.as.HTTP_STATUS_CODES.UNAUTHORIZED, "User authorization failed!");
                            reject("User authorization failed!");
                            /*} else if (req.routeCode != 0 && req.routeCode != 1001 && req.user.change_password_in_next_login === 'x') {
                                logger.debug("User must change password!");
                                RouteHelper.resp(res, global.as.HTTP_STATUS_CODES.FORBIDDEN, { error: "User must change password!", ref: 1001 });*/
                        } else {
                            resolve(task);
                        }
                    });
                },
                null, // optional params
                (task) => Promise.resolve(task),
                (task) => Promise.resolve(task)
            );
            txn.exec().then(_ => {
                next();
            }).catch(err => {
                global.logger.debug("Auth Check Failed. Error: " + err);
                next(err);
            });
        }
    },

    errorhandler: function (err: any, req: Request, res: Response, next: NextFunction) {
        global.logger.error("Request Error.", err);
        RouteHelper.resp(res, global.as.HTTP_STATUS_CODES.BAD_REQUEST, (err.message ? err.message : err));
        next();
    },

    resp: function (res: Response, code: HTTP_STATUS_CODES, msg: any) {
        const codeStr = code + "";
        if (codeStr.startsWith("2") || codeStr.startsWith("3")) {
            if (typeof msg === 'string')
                res.status(code).send({ result: "OK", payload: { msg } });
            else
                res.status(code).send(msg ? { result: "OK", payload: msg } : { result: "OK" });
        } else {
            if (typeof msg === 'string')
                res.status(code).send({ result: "FAIL", error: { msg } });
            else
                res.status(code).send(msg ? { result: "FAIL", error: msg } : { result: "FAIL", error: { msg: "NOK" } });
        }
    },

    validator: function (req: Request, res: Response, next: NextFunction) {
        try {
            for (let key in req.body) {
                const validator = require('../../validation/validation.js').validate;
                if (key.startsWith && key.startsWith("Device") && !validator(key, req.body[key])) {
                    next("Validation failed for " + key);
                    return;
                }
            }
            next();
        } catch (err) {
            next(err);
        }
    }
}

export default {
    secure: [
        RouteHelper.getClaim,
        RouteHelper.getUser,
        RouteHelper.logReq,
        RouteHelper.checkAuthorization,
        RouteHelper.validator
    ],
    insecure: [RouteHelper.validator],
    resp: RouteHelper.resp,
    errorhandler: RouteHelper.errorhandler
}
