"use strict";

const bcrypt = require('bcryptjs');
const format = require('pg-format');
const db = require('../custom_modules/db');
const config = require('../bin/config');
const salt = bcrypt.genSaltSync(10);

const checkIfUserExists = (email, callback) => {

    const query = {
        text: 'SELECT * from users where email = $1',
        values: [email]
    }

    db.pool.query(query, (err, user) => {

        let json;
        if (err) {
            json = {
                err: err,
                user: null
            }
        }
        else if (user.rows.length === 0){
            json = {
                err: null,
                user: null
            }
        }

        else {
            json = {
                err: null,
                user: user.rows[0]
            }
        }
        
        callback(json);

    })


}

const getUsers = (callback) => {

    const query = "SELECT * from users";

    db.pool.query(query, (err, result) => {

        let json = {
            err: err,
            result: result.rows
        }
        callback(json);

    })

}

const getUserById = (id, callback) => {

    const query = {
        text: 'SELECT * from users where id = $1',
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
            const { id, first_name, last_name, email, password } = result.rows[0];

            json = {
                err: err,
                user: {
                    id: id,
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    password: password
                }
            }
            callback(json);
        }


    })
}

const createUser = (user, callback) => {

    const { first_name, last_name, password, email } = user;
    const hash = bcrypt.hashSync(password, salt);

    const query = {
        text: 'INSERT INTO users(first_name, last_name, password, email) VALUES($1, $2, $3, $4)',
        values: [first_name, last_name, hash, email]
    };

    // callback
    db.pool.query(query, (err, result) => {
        let json = {
            err: err,
            message: ""
        }
        if (err) {
            json.message = "Kullanıcı oluşturulamamıştır."
            callback(json)
        } else {
            json.message = "Kullanıcı başarıyla oluşturulmuştur."
            callback(json)
        }
    })

}

const deleteUser = (user_id, callback) => {

    const query = {
        text: 'DELETE from users where id = $1',
        values: [user_id]
    }

    db.pool.query(query, (err, result) => {

        let json;
        if (err) {
            json = {
                err: err,
                message: "Kullanıcı silinirken problem yaşanmıştır.."
            }
            callback(json);
        }
        else {

            json = {
                err: err,
                message: "Kullanıcı başarıyla silinmiştir."
            }
            callback(json);
        }


    })

}

const updatePassword = (newPassword, id, callback) => {

    const hash = bcrypt.hashSync(newPassword, salt);
    const query = {
        text: 'UPDATE users SET password = $1 where id = $2',
        values: [hash, id]
    }

    db.pool.query(query, (err, result) => {

        let json;
        if (err) {
            json = {
                err: err,
                message: "Şifre değiştirilirken problem yaşanmıştır."
            }
            callback(json);
        }
        else {

            json = {
                err: err,
                message: "Şifre başarıyla değiştirilmiştir."
            }
            callback(json);
        }


    })

}
const updateUser = (user, callback) => {

    const {first_name, last_name, email, user_id} = user;
    const query = {
        text: 'UPDATE users SET first_name = $1, last_name = $2, email = $3 where id = $4',
        values: [first_name, last_name, email, user_id]
    }

    db.pool.query(query, (err, result) => {

        let json;
        if (err) {
            json = {
                err: err,
                message: "Kullanıcı güncellenirken problem yaşanmıştır."
            }
            callback(json);
        }
        else {

            json = {
                err: err,
                message: "Kullanıcı başarıyla güncellenmiştir."
            }
            callback(json);
        }


    })

}


module.exports = {
    getUsers,
    getUserById,
    createUser,
    deleteUser,
    updatePassword,
    updateUser,
    checkIfUserExists
    
}

