"use strict";

const db = require('../custom_modules/db');
const config = require('../bin/config');
const fs = require("fs");
const mime = require('mime-types');


const getModules = (course_id, callback) => {


    const query = {
        text: 'SELECT * from modules where course_id = $1 ORDER BY module_id',
        values: [course_id]
    }

    // callback
    db.pool.query(query, (err, result) => {
        let json = {
            err: err,
            message: ""
        }
        if (err) {
            json.message = "Hata oluşmuştur, lütfen tekrar deneyiniz."
            callback(json)
        } else {
            callback(result)
        }
    })

}

const addModule = (course_id, module_typeid, module_name, module_desc, file, is_downloadable, callback) => {

    const query = {
        text: 'SELECT * from modules where course_id = $1',
        values: [course_id]
    }

    // callback
    db.pool.query(query, (err, result) => {
        let json = {
            err: err,
            message: ""
        }
        if (err) {
            json.message = "Hata oluşmuştur, lütfen tekrar deneyiniz."
            callback(json)
        } else {
            let module_id;
            if (result.rows.length === 0) {
                module_id = 1;
            }
            else {
                module_id = result.rows.length + 1;
            }

            let filePath;
            let fileType;

            if (module_typeid == 1) {
                // Do actions for videos.
                filePath = "back-end/videos/" + course_id + "_" + module_id + ".mp4";
                fs.writeFileSync(filePath, file.data);
                filePath = course_id + "_" + module_id + ".mp4";

            }
            else if (module_typeid == 2) {
                // Do actions for pdf
                fileType = mime.extension(file.mimetype);
                filePath = "back-end/documents/" + course_id + "_" + module_id + "." + fileType;
                fs.writeFileSync(filePath, file.data);
                filePath = course_id + "_" + module_id + "." + fileType;

            }



            const query = {
                text: 'INSERT INTO modules(course_id, module_typeid, module_name, module_desc, module_path, module_id, is_downloadable)\
                 VALUES($1, $2, $3, $4, $5, $6, $7)',
                values: [course_id, module_typeid, module_name, module_desc, filePath, module_id, is_downloadable]
            }

            // callback
            db.pool.query(query, (err, result2) => {
                let json = {
                    err: err,
                    message: ""
                }
                if (err) {
                    json.message = "Hata oluşmuştur, lütfen tekrar deneyiniz."
                    callback(json)
                } else {

                    json.message = "Modül başarıyla yaratılmıştır."
                    console.log(result2);
                    callback(json)
                }
            })
        }
    })




}

const deleteModule = (module_id, callback) => {

    const query = {
        text: 'DELETE from modules where module_id = $1',
        values: [module_id]
    }

    db.pool.query(query, (err, result) => {

        let json = {
            err: err,
            message: "Silme işlemi başarıyla gerçekleşmiştir."
        }
        callback(json);

    })

}

const updateModule = (module_id, module_name, module_desc, is_downloadable, course_id, callback) => {

    const query = {
        text: 'UPDATE modules SET module_name = $1, module_desc = $2, is_downloadable = $4 where module_id = $3 AND course_id = $5',
        values: [module_name, module_desc, module_id, is_downloadable, course_id]
    }

    db.pool.query(query, (err, result) => {

        let json = {
            err: err,
            message: "Modül başarıyla güncellenmiştir."
        }


        callback(json);

    })

}

const updateFileModule = (module_id, course_id, module_type, file, callback) => {

    const query = {
        text: 'UPDATE modules SET module_typeid = $1 where module_id = $2 AND course_id = $3',
        values: [module_type, module_id, course_id]
    }

    db.pool.query(query, (err, result) => {

        let json = {
            err: err,
            message: "Modül başarıyla güncellenmiştir."
        }

        if (!err) {

            let filePath;
            let fileType;

            if (module_type == 1) {
                // Do actions for videos.
                filePath = "back-end/videos/" + course_id + "_" + module_id + ".mp4";
                fs.writeFileSync(filePath, file.data);
                filePath = course_id + "_" + module_id + ".mp4";

            }
            else if (module_type == 2) {
                // Do actions for pdf
                fileType = mime.extension(file.mimetype);
                filePath = "back-end/documents/" + course_id + "_" + module_id + "." + fileType;
                fs.writeFileSync(filePath, file.data);
                filePath = course_id + "_" + module_id + "." + fileType;

            }
            callback(json);

        }
        else {
            callback(json);

        }


    })

}



module.exports = {
    addModule,
    getModules,
    deleteModule,
    updateModule,
    updateFileModule
}

