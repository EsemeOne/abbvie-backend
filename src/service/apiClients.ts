import https from "https";
import http from "http";

const CustomClient = {
    getProto: function (url) {
        let proto: any = http;
        if (url.startsWith("https"))
            proto = https;
        return proto;
    },
    post: function (url: string, data: any, headers: any, contentType?: string) {
        return CustomClient.createReq(url, data, headers, 'POST', contentType);
    },
    put: function (url: string, data: any, headers: any, contentType?: string) {
        return CustomClient.createReq(url, data, headers, 'PUT', contentType);
    },
    createReq: function (url: string, data: any, headers: any, method: string, contentType?: string) {
        global.logger.info(method + " call. URL:" + url + ", Data: " + JSON.stringify(data));
        const options = {
            method: method,
            headers: {
                'Content-Type': (contentType ? contentType : 'application/json'),
                ...headers
            }
        };
        return new Promise((resolve, reject) => {
            const httpReq = CustomClient.getProto(url).request(url, options, res => {
                let dataRet = "";
                res.on('data', (chunk) => {
                    dataRet += chunk;
                });
                res.on('end', () => {
                    try {
                        global.logger.debug(method + " call result:" + dataRet + " \n Status Code:" + res.statusCode);
                        if (res.statusCode >= 200 && res.statusCode <= 299) {
                            let ret = dataRet;
                            resolve(ret);
                        } else if (res.statusCode >= 400 && res.statusCode <= 499) {
                            let ret = dataRet;
                            reject(ret);
                        } else {
                            reject(new Error("API call failed with status code " + res.statusCode));
                        }
                    } catch (e) {
                        reject(e);
                    }
                });
            }).on("error", (err) => {
                reject(err);
            });
            try {
                const sendBuf: string = (contentType ? data : JSON.stringify(data));
                httpReq.write(sendBuf);
                httpReq.end();
            } catch (e) {
                reject(e);
            }
        })
    },

    get: function (url: string, headers: any) {
        global.logger.info("GET call. URL:" + url);
        return new Promise((resolve, reject) => {
            const httpReq = CustomClient.getProto(url).get(url, { headers: headers }, res => {
                let dataRet = "";
                res.on('data', (chunk) => {
                    dataRet += chunk;
                });
                res.on('end', () => {
                    try {
                        global.logger.debug("GET call result:" + dataRet + " \n Status Code:" + res.statusCode);
                        if (res.statusCode >= 200 && res.statusCode <= 299) {
                            let ret = dataRet;
                            resolve(ret);
                        } else if (res.statusCode >= 400 && res.statusCode <= 499) {
                            let ret = dataRet;
                            reject(ret);
                        } else {
                            reject(new Error("API call failed with status code " + res.statusCode));
                        }
                    } catch (e) {
                        reject(e);
                    }
                });
            }).on("error", (err) => {
                reject(err);
            });
        })
    }
}

export default CustomClient;

