"use strict";
const db = require('../custom_modules/db');

const deleteRole = (id, callback) => {

    const query = {
        text: 'DELETE from roles where id = $1',
        values: [id]
    }

    db.pool.query(query, (err, result) => {

        let json = {
            err: err,
            message: "Silme işlemi başarıyla gerçekleşmiştir."
        }
        callback(json);

    })

}

const updateRole = (id, role_name, callback) => {

    const query = {
        text: 'UPDATE roles SET role_name = $1 where id = $2',
        values: [role_name, id]
    }

    db.pool.query(query, (err, result) => {

        let json = {
            err: err,
            message: "Rol başarıyla güncellenmiştir."
        }
        callback(json);

    })

}

const deleteUserRole = (user_id, role_id, callback) => {

    const query = {
        text: 'DELETE from user_roles where user_id = $1 AND role_id = $2',
        values: [user_id, role_id]
    }

    db.pool.query(query, (err, result) => {

        let json;
        if (err) {
            json = {
                err: err,
                message: "Rol kullanıcıdan silinirken problem yaşanmıştır."
            }
            callback(json);
        }
        else {

            json = {
                err: err,
                message: "Rol başarıyla kullanıcıdan silinmiştir."
            }
            callback(json);
        }


    })

}

const checkIfUserHasPermission = (user_id, permission_id, callback) => {

    const query = {
        text: 'SELECT * from role_permissions, user_roles where user_roles.user_id = $1 AND role_permissions.role_id = user_roles.role_id AND role_permissions.permission_id = $2',
        values: [user_id, permission_id]
    }

    db.pool.query(query, (err, result) => {

        let json;
        if (err) {
            json = {
                err: err,
                exists: null
            }
        }
        if (result.rows.length == 0) {
            json = {
                err: null,
                exists: false
            }
        }
        else if (result.rows.length > 0){
            json = {
                err: null,
                exists: true
            }
        }
        
        
        callback(json);

    })

}

const getUserPermissions = (user_id, callback) => {


    const query = {
        text: 'SELECT permission_id from role_permissions, user_roles where user_roles.user_id = $1 AND role_permissions.role_id = user_roles.role_id',
        values: [user_id]
    }

    db.pool.query(query, (err, result) => {

        let json;
        let resultArray = [];
        if (result.rows.length > 0){

            

            for(let i = 0; i < result.rows.length; i++){
                resultArray.push(result.rows[i].permission_id);
            }

            json = {
                err: null,
                result: resultArray
            }
        }
        else if (result.rows.length == 0) {
            json = {
                err: null,
                result: resultArray
            }
        }
        else {
            json = {
                err: err,
                result: null
            }
        }
        
        callback(json);

    })

}

const getRolePermissions = (role_id, callback) => {


    const query = {
        text: 'SELECT * from role_permissions, permissions where role_permissions.role_id = $1 AND role_permissions.permission_id = permissions.id',
        values: [role_id]
    }

    db.pool.query(query, (err, result) => {

        let json;
        if (result.rows.length > 0){

            json = {
                err: null,
                result: result.rows
            }
        }
        else if (result.rows.length == 0) {
            json = {
                err: null,
                result: result.rows
            }
        }
        else {
            json = {
                err: err,
                result: null
            }
        }
        
        callback(json);

    })

}

const getPermissions = (callback) => {


    const query = {
        text: 'SELECT * from permissions',

    }

    db.pool.query(query, (err, result) => {

        let json;
        if (result.rows.length > 0){

            json = {
                err: null,
                result: result.rows
            }
        }
        else if (result.rows.length == 0) {
            json = {
                err: null,
                result: null
            }
        }
        else {
            json = {
                err: err,
                result: null
            }
        }
        
        callback(json);

    })

}

const addRolePermission = (role_id, permission_id, callback) => {

    const query = {
        text: 'INSERT INTO role_permissions(role_id, permission_id) VALUES($1, $2)',
        values: [role_id, permission_id]
    }

    db.pool.query(query, (err, result) => {

        let json;
        if(!err){
            json = {
                err: null,
                message: "Rol yetkisi başarıyla eklenmiştir."
            }
        }
        else {
            json = {
                err: null,
                message: "Rol yetkisi eklenirken problem yaşanmıştır."
            }
        }

        callback(json);

    })

}

const deleteRolePermission = (role_id, permission_id, callback) => {

    const query = {
        text: 'DELETE from role_permissions where role_id = $1 AND permission_id = $2',
        values: [role_id, permission_id]
    }

    db.pool.query(query, (err, result) => {

        let json;
        if (err) {
            json = {
                err: err,
                message: "Yetki rolden silinirken problem yaşanmıştır."
            }
            callback(json);
        }
        else {

            json = {
                err: null,
                message: "Yetki başarıyla rolden silinmiştir."
            }
            callback(json);
        }


    })

}

module.exports = {
    deleteRole,
    updateRole,
    deleteUserRole,
    checkIfUserHasPermission,
    getUserPermissions,
    getPermissions,
    getRolePermissions,
    addRolePermission,
    deleteRolePermission
    
}

