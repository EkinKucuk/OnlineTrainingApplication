"use strict";

const db = require('../custom_modules/db');
const config = require('../bin/config');

const addCourse = (course, callback) => {

    const { course_name, course_desc, course_goals, course_type, course_status, course_hasExam, course_isPrivate, startDate, endDate } = course;

    const query = {
        text: 'INSERT INTO course(course_name, course_desc, course_goals, course_type,\
        course_status, course_hasexam, course_isprivate, startdate, enddate) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        values: [course_name, course_desc, course_goals, course_type, course_status, course_hasExam, course_isPrivate, startDate, endDate]
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
            json.message = "Kurs başarıyla yaratılmıştır."
            callback(json)
        }
    })

}

const createCourseUser = (course_user, callback) => {

    const { course_id, user_id, role_id } = course_user;


    const query = {
        text: 'INSERT INTO course_roles(course_id, user_id, role_id) VALUES($1, $2, $3)',
        values: [course_id, user_id, role_id]
    }

    // callback
    db.pool.query(query, (err, result) => {
        let json = {
            err: err,
            message: ""
        }
        if (err) {
            json.message = "Hata oluşmuştur, lütfen tekrardan deneyiniz."
            callback(json)
        } else {
            json.message = "Kullanıcı başarıyla kursa atanmıştır."
            callback(json)
        }
    })

}

const getCourseUserById = (id, callback) => {

    const query = {
        text: 'SELECT * course_users where id = $1',
        values: [id]
    }

    db.pool.query(query, (err, result) => {
        let json;
        if (err) {
            json = {
                err: err,
                result: null
            }
            callback(json);
        }
        else {

            json = {
                err: err,
                result: result.rows[0]
            }
            callback(json);
        }


    })
}

const getCourseUsers = (course_id, callback) => {

    const query = {
        text: 'SELECT users.id, users.first_name, users.last_name, \
        users.email, roles.role_name, roles.id as role_id from course_roles, \
        users, roles where course_roles.course_id = $1 AND users.id = course_roles.user_id AND course_roles.role_id = roles.id',
        values: [course_id]
    }

    db.pool.query(query, (err, result) => {
        let json;
        if (err) {
            json = {
                err: err,
                result: null
            }
            callback(json);
        }
        else {

            json = {
                err: err,
                result: result.rows
            }
            callback(json);
        }


    })
}

const getUsersForCourse = (course_id, callback) => {

    const query = {
        text: 'SELECT users.id, users.first_name, users.last_name, users.email \
        from users where NOT EXISTS (SELECT from course_roles, user_roles where course_roles.user_id = users.id AND course_roles.course_id = $1);',
        values: [course_id]
    }

    db.pool.query(query, (err, result) => {
        let json;
        if (err) {
            json = {
                err: err,
                result: null
            }
            callback(json);
        }
        else {

            json = {
                err: err,
                result: result.rows
            }
            callback(json);
        }


    })
}

const getCourses = (callback) => {

    const query = {
        text: 'SELECT course.id, course_name, course_desc, course_goals, course_type, course_status, course_hasexam,\
        course_isprivate, startdate, enddate, type_name \
        from course, course_types where course.course_type = course_types.id',
    }

    db.pool.query(query, (err, result) => {
        let json;
        if (err) {
            json = {
                err: err,
                result: null
            }
            callback(json);
        }
        else {

            json = {
                err: err,
                result: result.rows
            }
            callback(json);
        }


    })

}

const getUserManagedCourses = (user_id, callback) => {

    const query = {
        text: 'SELECT course.id, course_name, course_desc, course_goals, course_type, course_status, course_hasexam,\
        course_isprivate, startdate, enddate, type_name, role_name \
        from course, course_roles, role_permissions, course_types, roles where course.course_type = course_types.id AND course_roles.user_id = $1\
         AND role_permissions.role_id = course_roles.role_id AND role_permissions.permission_id = $2 AND course_roles.course_id = course.id AND roles.id = course_roles.role_id',
        values: [user_id, config.permissionTypes.manage_course]
    }

    db.pool.query(query, (err, result) => {
        let json;
        if (err) {
            json = {
                err: err,
                result: null
            }
            callback(json);
        }
        else {

            json = {
                err: err,
                result: result.rows
            }
            callback(json);
        }


    })

}

const getPublicCourses = (user_id, callback) => {

    const query = {
        text: 'SELECT course.id, course_name, course_desc, course_goals, course_type, course_status, \
        course_hasexam, course_isprivate, startdate, enddate, type_name \
        from course, course_types where course.course_type = course_types.id \
         AND course.course_isprivate = false AND course_status = true',
    }

    db.pool.query(query, (err, result) => {
        let json;
        if (err) {
            json = {
                err: err,
                result: null
            }
            callback(json);
        }
        else {

            json = {
                err: err,
                result: result.rows
            }
            callback(json);
        }


    })

}



const getUserCourses = (userid, callback) => {

    const query = {
        text: 'SELECT course.id, course_name, course_desc, course_goals, course_type, course_status, course_hasexam,\
        course_isprivate, startdate, enddate, type_name \
        from course, course_types, course_roles where course.course_type = course_types.id AND course_roles.user_id = $1 AND course_roles.course_id = course.id AND course.course_status = true',
        values: [userid]
    }

    db.pool.query(query, (err, result) => {
        let json;
        if (err) {
            json = {
                err: err,
                result: null
            }
            callback(json);
        }
        else {

            json = {
                err: err,
                result: result.rows
            }
            callback(json);
        }


    })

}

const getCoursesByWord = (word, callback) => {

    const wordPattern = word + "%"
    const query = {
        text: 'SELECT course.id, course_name, course_desc, course_goals, course_type, course_status, course_hasexam,\
        course_isprivate, startdate, enddate, type_name \
        from course, course_types where course.course_type = course_types.id AND LOWER(course_name) LIKE LOWER($1)',
        values: [wordPattern]
    }


    db.pool.query(query, (err, result) => {
        let json;
        if (err) {
            json = {
                err: err,
                result: null
            }
            callback(json);
        }
        else {

            json = {
                err: err,
                result: result.rows
            }
            callback(json);
        }


    })

}

const addCourseType = (type_name, callback) => {

    const query = {
        text: 'INSERT INTO course_types(type_name) VALUES($1)',
        values: [type_name]
    }

    // callback
    db.pool.query(query, (err, results) => {
        let json;
        if (err) {
            json = {
                err: err,
                result: null
            }
            callback(json);
        }
        else {

            json = {
                err: err,
                result: results.rows[0]
            }
            callback(json);
        }
    })

}
const deleteCourseType = (id, callback) => {

    const query = {
        text: 'DELETE from course_types where id = $1',
        values: [id]
    }

    db.pool.query(query, (err, result) => {

        let json;
        if (err) {
            json = {
                err: err,
                message: "Kurs tipi silinirken problem yaşanmıştır."
            }
            callback(json);
        }
        else {

            json = {
                err: err,
                message: "Kurs tipi başarıyla silinmiştir."
            }
            callback(json);
        }


    })

}

const deleteCourseUser = (course_id, user_id, callback) => {

    const query = {
        text: 'DELETE from course_roles where user_id = $1 AND course_id = $2',
        values: [user_id, course_id]
    }

    db.pool.query(query, (err, result) => {

        let json;
        if (err) {
            json = {
                err: err,
                message: "Kurs tipi silinirken problem yaşanmıştır."
            }
            callback(json);
        }
        else {

            json = {
                err: err,
                message: "Kurs tipi başarıyla silinmiştir."
            }
            callback(json);
        }


    })

}

const deleteCourse = (course_id, callback) => {

    const query = {
        text: 'DELETE from course where id = $1',
        values: [course_id]
    }

    db.pool.query(query, (err, result) => {

        let json;
        if (err) {
            json = {
                err: err,
                message: "Kurs silinirken problem yaşanmıştır."
            }
            callback(json);
        }
        else {

            json = {
                err: err,
                message: "Kurs başarıyla silinmiştir."
            }
            callback(json);
        }


    })

}

const updateCourseType = (id, type_name, callback) => {

    const query = {
        text: 'UPDATE course_types SET type_name = $1 where id = $2',
        values: [type_name, id]
    }

    db.pool.query(query, (err, result) => {

        let json = {
            err: err,
            message: "Kurs tipi başarıyla güncellenmiştir."
        }
        callback(json);

    })

}

const updateCourse = (course, callback) => {

    const { course_name, course_desc, course_goals, course_id, course_status, course_isPrivate, course_hasexam } = course;
    const query = {
        text: 'UPDATE course SET course_name = $1, course_desc = $2, course_goals = $3, course_status = $4, course_isPrivate = $5, course_hasexam = $6 where id = $7',
        values: [course_name, course_desc, course_goals, course_status, course_isPrivate, course_hasexam, course_id]
    }

    db.pool.query(query, (err, result) => {

        let json;
        if (err) {
            json = {
                err: err,
                message: "Kurs güncellenirken problem yaşanmıştır."
            }
            callback(json);
        }
        else {

            json = {
                err: err,
                message: "Kurs başarıyla güncellenmiştir."
            }
            callback(json);
        }


    })

}

const enrollRequest = (course_id, user_id, callback) => {

    let query;

    query = {
        text: "SELECT FROM course_roles where user_id = $1 AND course_id = $2",
        values: [user_id , course_id]
    }

    db.pool.query(query, (err, result) => {
        let json = {
            err: err,
            message: ""
        }

        if (err) {
            json.message = "Hata oluşmuştur, lütfen tekrardan deneyiniz."
            callback(json)
        } else {

            if(result.rows.length === 0){

                query = {
                    text: 'INSERT INTO course_enrollrequest(course_id, user_id) VALUES($1, $2)',
                    values: [course_id, user_id]
                }
            
                // callback
                db.pool.query(query, (err, result) => {
                    let json = {
                        err: err,
                        message: ""
                    }
                    if (err) {
                        json.message = "Hata oluşmuştur, lütfen tekrardan deneyiniz."
                        callback(json)
                    } else {
                        json.message = "İstek başarıyla oluşturulmuştur."
                        callback(json)
                    }
                })            

            }
            else {
                json.err = "Zaten kursa atanmıştır."
                json.message = "Zaten kursa atanmıştır."
                callback(json)
            }
            
        }
    })

    
}

const getEnrollRequests = (course_id, callback) => {

    const query = {
        text: 'SELECT * from users, course_enrollrequest where course_enrollrequest.course_id = $1 AND course_enrollrequest.user_id = users.id',
        values: [course_id]
    }


    db.pool.query(query, (err, result) => {
        let json;
        if (err) {
            json = {
                err: err,
                result: null
            }
            callback(json);
        }
        else {

            json = {
                err: err,
                result: result.rows
            }
            callback(json);
        }


    })

}

const deleteEnrollRequest = (course_id, user_id, callback) => {

    const query = {
        text: 'DELETE from course_enrollrequest where user_id = $1 AND course_id = $2',
        values: [user_id, course_id]
    }

    db.pool.query(query, (err, result) => {

        let json;
        if (err) {
            json = {
                err: err,
                message: "Kurs silinirken problem yaşanmıştır."
            }
            callback(json);
        }
        else {

            json = {
                err: err,
                message: "Kurs başarıyla silinmiştir."
            }
            callback(json);
        }


    })

}



module.exports = {
    createCourseUser,
    getCourseUserById,
    addCourseType,
    deleteCourseType,
    updateCourseType,
    deleteCourse,
    addCourse,
    getCourses,
    getCoursesByWord,
    getUserCourses,
    updateCourse,
    getCourseUsers,
    deleteCourseUser,
    getUsersForCourse,
    getUserManagedCourses,
    getPublicCourses,
    enrollRequest,
    getEnrollRequests,
    deleteEnrollRequest

}

