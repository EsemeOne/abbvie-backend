const routeCodes = {
    NO_CHECK: { code: 0, routes: ["/seb/me"] },
    REMOVE_USER: { code: 1001, route: "/seb/removeuser" },
    GET_ROLES: { code: 1002, route: "/role/get-roles" },
    GET_USER_ROLE: { code: 1003, route: "/role/get-user-role" },
    SET_USER_ROLE: { code: 1004, route: "/role/set-user-role" },
    TEST_API: { code: 1005, route: "/test/testapi" },
    UPDATE_USER: { code: 1008, route: "/seb/updateuserdata" },
    GET_USER_DATA: { code: 1009, route: "/seb/getuserdata" },
    CHANGE_PWD: { code: 1010, route: "/seb/changepassword" },
}

global.as.routeCodes = routeCodes;

enum HTTP_STATUS_CODES {
    OK = 200,
    CREATED = 201,
    MOVED_PERMANENTLY = 301,
    FOUND = 302,
    SEE_OTHER = 303,
    NOT_MODIFIED = 304,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    PAYMENT_REQUIRED = 402,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504
}

global.as.HTTP_STATUS_CODES = HTTP_STATUS_CODES;

global.as.isEmpty = function (obj: any) {
    return typeof obj === 'undefined' || obj === null || !obj || (Array.isArray(obj) && obj.length == 0);
};


