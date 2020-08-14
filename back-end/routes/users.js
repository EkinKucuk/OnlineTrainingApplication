"use strict";

const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const config = require('../bin/config');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator/check');
const ResponseHandler = require('../custom_modules/response_handler');
const CrudOperations = require('../custom_modules/crud_operations');

/* GET users listing. */
router.get('/', function (req, res, next) {

  CrudOperations.getUsers(function (result) {
    if (result.err) {
      ResponseHandler.returnDataBaseError(result.err, res);
    }
    else {
      ResponseHandler.returnJSONObject(res, result.result);
    }
  });


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

router.delete('/deleteuser', [

  check('user_id').isInt(),

], (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  // Validated.

  const { user_id } = req.body;

  CrudOperations.deleteUser(user_id, function (result) {
    if (result.err) {
      ResponseHandler.returnDataBaseError(result.err, res);
    }
    else {
      ResponseHandler.returnJSONObject(res, result.message);
    }
  });



});

router.post('/createuser', [

  check('first_name').isLength({ min: 1 }),
  check('last_name').isLength({ min: 1 }),
  check('password').isLength({ min: 6 }),
  check('email').isEmail()

], (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  // Validated.

  const { first_name, last_name, password, email } = req.body;
  const user = {
    first_name: first_name,
    last_name: last_name,
    password: password,
    email: email
  }
  CrudOperations.createUser(user, function (result) {

    if (result.err) {
      ResponseHandler.returnDataBaseError(result.err, res);
    }
    else {
      ResponseHandler.returnJSONObject(res, result.message);
    }
  });

});


router.put('/updateuser', [

  check('first_name').isLength({ min: 3 }),
  check('last_name').isLength({ min: 3 }),
  check('email').isEmail(),
  check('user_id').isInt()

], (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  // Validated.

  const { first_name, last_name, user_id, email } = req.body;
  const user = {
    first_name: first_name,
    last_name: last_name,
    user_id: user_id,
    email: email
  }
  CrudOperations.updateUser(user, function (result) {
    if (result.err) {
      ResponseHandler.returnDataBaseError(result.err, res);
    }
    else {
      ResponseHandler.returnJSONObject(res, result);
    }
  });

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
