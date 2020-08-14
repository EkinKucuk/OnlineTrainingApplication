"use strict";

const express = require('express');
const router = express.Router();
const db = require('../custom_modules/db');
const config = require('../bin/config');
const format = require('pg-format');
const { check, validationResult } = require('express-validator/check');
const ModuleController = require('../custom_modules/module_operations');
const ResponseHandler = require('../custom_modules/response_handler');
const moment = require('moment');
const fs = require('fs');
moment.locale('tr');


// Add course types.
router.post('/createmodule', [

    check('course_id').isInt(),
    check('module_typeid').isInt(),
    check('module_name').isLength({ min: 3 }),
    check('module_desc').isLength({ min: 3 }),
    check('is_downloadable').isBoolean()

] ,(req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  // Validated.

  const { course_id, module_typeid, module_name, module_desc, is_downloadable } = req.body;
  if(!req.files){
    ResponseHandler.returnError(res, "No file");
  }

  ModuleController.addModule(course_id, module_typeid, module_name, module_desc, req.files.file, is_downloadable, function (result) {

    if (result.err) {
      ResponseHandler.returnDataBaseError(result.err, res);
    }
    else {
      ResponseHandler.returnJSONObject(res, result.result);
    }

  })

});

router.delete('/deletemodule', [

  check('module_id').isInt(),

], (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
  }
  // Validated.

  const { module_id } = req.body;
  ModuleController.deleteModule(module_id, function(result) {

      if(result.err){
          ResponseHandler.returnDataBaseError(result.err, res);
      }
      else {
          ResponseHandler.returnJSONObject(res, result.message)
      }

  })

});

router.put('/updatemodule', [

  check('module_id').isInt(),
  check('course_id').isInt(),
  check('module_name').isLength({ min: 3 }),
  check('module_desc').isLength({ min: 3 })

], (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
  }
  // Validated.

  const { module_id, module_name, module_desc, course_id, is_downloadable } = req.body;
  ModuleController.updateModule(module_id, module_name, module_desc, is_downloadable, course_id, function(result) {

      if(result.err){
          ResponseHandler.returnDataBaseError(result.err, res);
      }
      else {
          ResponseHandler.returnJSONObject(res, result.message)
      }

  })

 

});

router.put('/updatemodulefile', [

  check('module_id').isInt(),
  check('module_type').isInt(),
  check('course_id').isInt(),

], (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
  }
  // Validated.

  if(!req.files){
    ResponseHandler.returnError(res, "No file");
  }

  const { module_id, course_id, module_type, } = req.body;
  ModuleController.updateFileModule(module_id, course_id, module_type, req.files.file, function(result) {

      if(result.err){
          ResponseHandler.returnDataBaseError(result.err, res);
      }
      else {
          ResponseHandler.returnJSONObject(res, result.message)
      }

  })

 

});

module.exports = router;
