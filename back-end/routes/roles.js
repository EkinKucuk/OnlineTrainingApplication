"use strict";

const express = require('express');
const router = express.Router();
const db = require('../custom_modules/db');
const config = require('../bin/config');
const format = require('pg-format');
const { check, validationResult } = require('express-validator/check');
const RolesController = require('../custom_modules/role_operations');
const ResponseHandler = require('../custom_modules/response_handler');

/* GET roles listing. */
router.get('/', function (req, res, next) {

    const query = "SELECT * from roles ORDER BY role_name ASC;";
    db.pool.query(query, (err, result) => {
        if (err) {
            res.status(500);
            res.send(err.stack);
        } else {
            res.json(result.rows);
        }
    })
});

router.get('/getpermissions', function (req, res, next) {

    RolesController.getPermissions(function(result) {

        if(result.err){
            ResponseHandler.returnDataBaseError(result.err, res);
        }
        else {
            ResponseHandler.returnJSONObject(res, result.result)
        }

    })
});

router.get('/getrolepermissions', [

    check('role_id').isInt(),

], (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const {role_id} = req.query;

    // Validated.

    RolesController.getRolePermissions(role_id, function(result) {

        if(result.err){
            ResponseHandler.returnDataBaseError(result.err, res);
        }
        else {
            ResponseHandler.returnJSONObject(res, result.result)
        }

    })

});

router.post('/addrolepermission', [

    check('role_id').isInt(),
    check('permission_id').isInt(),

], (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    // Validated.

    const { permission_id, role_id } = req.body;

    RolesController.addRolePermission(role_id, permission_id, function(result) {

        if(result.err){
            ResponseHandler.returnDataBaseError(result.err, res);
        }
        else {
            ResponseHandler.returnJSONObject(res, result.message)
        }

    })

});

router.delete('/deleterolepermission', [

    check('role_id').isInt(),
    check('permission_id').isInt(),

], (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    // Validated.

    const { role_id, permission_id } = req.body;
    RolesController.deleteRolePermission( role_id, permission_id, function(result) {

        if(result.err){
            ResponseHandler.returnDataBaseError(result.err, res);
        }
        else {
            ResponseHandler.returnJSONObject(res, result.message)
        }

    })

});

// Get role by ID.
router.get('/getrole', [

    check('id').isInt(),

], (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    // Validated.

    const { id } = req.query;

    const query = {
        text: 'SELECT * from roles where id = $1',
        values: [id]
    }


    db.pool.query(query, (err, result) => {
        if (err) {
            console.log(err.stack)
        } else {
            res.json(result.rows);
        }
    })

});
// Add role.
router.post('/addrole', [

    check('role_name').isLength({ min: 3 }),

], (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    // Validated.

    const { role_name } = req.body;

    const query = {
        text: 'INSERT INTO roles(role_name) VALUES($1)',
        values: [role_name]
    }

    // callback
    db.pool.query(query, (err, result) => {
        if (err) {
            res.status(500);
            res.send(err);
        } else {
            res.json(result);
        }
    })

});

router.delete('/deleterole', [

    check('role_id').isInt(),

], (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    // Validated.

    const { role_id } = req.body;
    RolesController.deleteRole(role_id, function(result) {

        if(result.err){
            ResponseHandler.returnDataBaseError(result.err, res);
        }
        else {
            ResponseHandler.returnJSONObject(res, result.message)
        }

    })

   

});

router.put('/updaterole', [

    check('role_id').isInt(),
    check('role_name').isLength({ min: 3 })

], (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    // Validated.

    const { role_id, role_name } = req.body;
    RolesController.updateRole(role_id, role_name, function(result) {

        if(result.err){
            ResponseHandler.returnDataBaseError(result.err, res);
        }
        else {
            ResponseHandler.returnJSONObject(res, result.message)
        }

    })

   

});

// Assign a role to the user.
router.post('/adduserrole', [

    check('role_id').isInt(),
    check('user_id').isInt(),

], (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    // Validated.

    const { role_id, user_id } = req.body;

    const query = {
        text: 'INSERT INTO user_roles(role_id, user_id) VALUES($1, $2)',
        values: [role_id, user_id]
    }

    // callback
    db.pool.query(query, (err, result) => {
        if (err) {
            res.status(500);
            res.send(err);
        } else {
            res.send(result);
        }
    })

});

router.delete('/deleteuserrole', [

    check('role_id').isInt(),
    check('user_id').isInt(),

], (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    // Validated.

    const { role_id, user_id } = req.body;
    RolesController.deleteUserRole( user_id, role_id, function(result) {

        if(result.err){
            ResponseHandler.returnDataBaseError(result.err, res);
        }
        else {
            ResponseHandler.returnJSONObject(res, result.message)
        }

    })

});
// Get all users roles assigned to a user by user_id.
router.get('/getrolesbyuserid', [

    check('user_id').isInt(),

], (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    // Validated.

    const { user_id } = req.query;

    const query = {
        text: 'SELECT roles.role_name, roles.id from roles, \
        user_roles where user_roles.user_id = $1 AND roles.id = user_roles.role_id',
        values: [user_id]
    }


    db.pool.query(query, (err, result) => {
        if (err) {
            console.log(err.stack)
        } else {
            res.json(result.rows);
        }
    })

});
// Get all users assigned to a specific role by role_id.
router.get('/getusersbyroleid', [

    check('role_id').isInt(),

], (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    // Validated.

    const { role_id } = req.query;

    const query = {
        text: 'SELECT users.id, users.first_name, users.last_name, users.email \
        from users LEFT JOIN user_roles ON user_roles.user_id = users.id where user_roles.role_id = $1',
        values: [role_id]
    }


    db.pool.query(query, (err, result) => {
        if (err) {
            console.log(err.stack)
        } else {
            res.json(result.rows);
        }
    })

});


module.exports = router;
