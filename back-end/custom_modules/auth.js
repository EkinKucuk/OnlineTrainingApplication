const jwt = require('jsonwebtoken');
const CrudOperations = require('../custom_modules/crud_operations');
const config = require('../bin/config');
const ResponseHadler = require('../custom_modules/response_handler');


module.exports = function (req, res, next) {

    const token = req.headers.authorization;
    if (token ===  null || token === undefined) {
        res.send("no token.");
    }
    jwt.verify(token, config.tokenKey, function (err, payload) {
        if (payload) {
            CrudOperations.getUserById(payload.id, function (user) {
                if (user != null) {
                    req.body.usertoken_id = payload.id;
                    next();
                }
                else {
                    ResponseHadler.returnError(res, "Not auth");
                }
            });
        }
        else {
            ResponseHadler.returnError(res, "Not auth");
        }
    })
}