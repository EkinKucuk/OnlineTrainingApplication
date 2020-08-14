"use strict";

const express = require('express');
const router = express.Router();
const db = require('../custom_modules/db');
const config = require('../bin/config');
const { check, validationResult } = require('express-validator/check');
const RoleController = require('../custom_modules/role_operations');
const ResponseHandler = require('../custom_modules/response_handler');
const ModuleController = require('../custom_modules/module_operations');
const CourseController = require('../custom_modules/course_operations');
const CrudOperations = require('../custom_modules/crud_operations');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get('/getuserpermissions', function (req, res, next) {
    RoleController.getUserPermissions(req.body.usertoken_id, function (result) {
  
      if (result.err) {
        ResponseHandler.returnDataBaseError(result.err, res);
      }
      else {
        ResponseHandler.returnJSONObject(res, result.result);
      }
  
    })
});

router.get('/getuser', (req, res, next) => {

  const token = req.headers.authorization;
  if (token ===  null || token === undefined) {
      res.send("no token.");
  }
  jwt.verify(token, config.tokenKey, function (err, payload) {
      if (payload) {
          const user_id = payload.id;
          CrudOperations.getUserById(user_id, function (result) {
            if (result.err) {
              res.send(result.err);
            }
            else {
              res.json(result.user);
            }
          });
      }
      else {
          ResponseHadler.returnError(res, "Not auth");
      }
  })

});

router.get('/getmodules', [

  check('course_id').isInt(),

], (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  // Validated.

  const { course_id } = req.query;
  ModuleController.getModules(course_id, function (result) {

    if (result.err) {
      ResponseHandler.returnDataBaseError(result.err, res);
    }
    else {
      ResponseHandler.returnJSONObject(res, result)
    }

  })

});

router.get('/getusermanagedcourses', function (req, res, next) {
  CourseController.getUserManagedCourses(req.body.usertoken_id, function (result) {

    if (result.err) {
      ResponseHandler.returnDataBaseError(result.err, res);
    }
    else {
      ResponseHandler.returnJSONObject(res, result.result)
    }

  })
});

router.get('/getpubliccourses', function (req, res, next) {
  CourseController.getPublicCourses( req.body.usertoken_id, function (result) {

    if (result.err) {
      ResponseHandler.returnDataBaseError(result.err, res);
    }
    else {
      ResponseHandler.returnJSONObject(res, result.result)
    }

  })
});

router.put('/changepassword', [

  check('password').isLength({ min: 6 }),
  check('user_id').isInt()

], (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  // Validated.

  const { user_id, password} = req.body;

  CrudOperations.getUserById(user_id, function (result) {
    if (result.err) {
      ResponseHandler.returnDataBaseError(result.err, res);
    }
    else {

      bcrypt.compare(password, result.user.password, function (err, result) {
        if (err) {
          ResponseHandler.returnSystemError(res);
        }
        else if (result == false) {

          CrudOperations.updatePassword(password, user_id, function(result) {
              if (result.err) {
                ResponseHandler.returnDataBaseError(result.err, res);
              }
              else {
                ResponseHandler.returnJSONObject(res, result);
              }
          })

        }
        else {
          ResponseHandler.returnError(res, "Şifreler aynı girilmiştir. Lütfen tekrar deneyiniz.");
        }
      });

    }

  });


});


module.exports = router;
