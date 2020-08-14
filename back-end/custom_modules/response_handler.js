
module.exports = {
    returnDataBaseError: function (error, res) {

        const errorMessage = {
            errormsg: "Veri tabanı ile alakalı, sistemsel bir hata oluşmuştur. Lütfen sistem yöneticilerine ulaşınız.",
            error: error
        };
        res.statusCode = 500;
        res.json(errorMessage);
    },
    returnError: function (res, error) {

        const message = {
            errormsg: error
        };
        res.statusCode = 500;
        res.json(message);

    },
    returnNotFound: function (res, error) {
        const message = {
            errormsg: error
        };
        res.statusCode = 404;
        res.json(message);
    },
    returnSystemError: function (res) {

        const message = {
            errormsg: "Sistemsel bir hata oluşmuştur. Lütfen tekrar deneyiniz."
        }
        res.statusCode = 500;
        res.json(message);

    },
    returnSuccess(res, message) {
        const messageObject = {
            errormsg: message
        };
        res.statusCode = 200;
        res.json(messageObject);
    },
    returnJSONObject(res, jsonData) {

        res.statusCode = 200;
        res.json(jsonData);

    }



}
