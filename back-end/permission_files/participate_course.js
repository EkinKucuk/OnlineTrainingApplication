
const RoleOperations = require('../custom_modules/role_operations');
const config = require('../bin/config');
const ResponseHadler = require('../custom_modules/response_handler');


module.exports = function (req, res, next) {

    RoleOperations.checkIfUserHasPermission(req.body.usertoken_id, config.permissionTypes.participate_course, function (result) {
        
        if (result.exists == true) {
            next();
        }
        else {
            ResponseHadler.returnError(res, "Not autharized.");
        }
    });

}