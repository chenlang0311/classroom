"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_1 = require("../config/validate");
const utils = require("./utils");
async function validate(req, res, next) {
    let [baseurl, route] = [req.baseUrl, req.route.path];
    let schema = typeof validate_1.validate[baseurl] != 'undefined' ? validate_1.validate[baseurl][route] : null;
    if (schema)
        req.check(schema);
    let result = await req.getValidationResult();
    if (!result.isEmpty())
        return res.sendErr(result.array()[0].msg);
    next();
}
exports.validate = validate;
exports.customValidators = {
    myWhitelisted: (param, ...args) => args.indexOf(param) >= 0,
    myIsArray: (param) => Object.prototype.toString.call(param) === '[object Array]',
    myIsString: (param) => utils.isString(param),
    myIsStrOrNum: (param) => utils.isString(param) || utils.isNumber(param),
    myAccountPrice: (param, ...args) => {
        if (!param)
            return true;
        let price = ['price_publish', 'price_quote', 'price_cost', 'price_min'];
        for (let i = 0, len = price.length; i < len; i++) {
            if (param[price[i]] && isNaN(param[price[i]]))
                return false;
        }
        for (let i = 0, len = args.length; i < len; i++) {
            if (!param[args[i]])
                return false;
        }
        return true;
    },
    myDate: (param) => {
        if (!param)
            return false;
        let result = param.match(/^(\d{1,4})-(\d{1,2})-(\d{1,2})$/);
        if (result == null)
            return false;
        let d = new Date(result[1], result[2] - 1, result[3]);
        return (d.getFullYear() == result[1] && (d.getMonth() + 1) == result[2] && d.getDate() == result[3]);
    },
    myDateTime: (param) => {
        if (!param)
            return false;
        let result = param.match(/^(\d{1,4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/);
        if (result == null)
            return false;
        let d = new Date(result[1], result[2] - 1, result[3], result[4], result[5], result[6]);
        return (d.getFullYear() == result[1] && (d.getMonth() + 1) == result[2] && d.getDate() == result[3] &&
            d.getHours() == result[4] && d.getMinutes() == result[5] && d.getSeconds() == result[6]);
    },
    myNumber: (param) => {
        if (!param) {
            return true;
        }
        let res = param.split(",");
        for (let i = 0; i < res.length; i++) {
            let n = Number(res[i]);
            if (isNaN(n)) {
                return false;
            }
        }
        return true;
    }
};
function errorFormatter(param, msg, value) {
    let namespace = (param + '').split('.'), root = namespace.shift(), formParam = root;
    while (namespace.length)
        formParam += '[' + namespace.shift() + ']';
    return {
        param: formParam,
        msg: msg,
        value: value
    };
}
exports.errorFormatter = errorFormatter;

//# sourceMappingURL=../maps/lib/validator.js.map
