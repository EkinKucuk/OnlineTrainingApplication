"use strict";

const express = require('express');
const router = express.Router();
const db = require('../custom_modules/db');
const config = require('../bin/config');
const format = require('pg-format');
const { check, validationResult } = require('express-validator/check');
const CourseController = require('../custom_modules/course_operations');
const ResponseHandler = require('../custom_modules/response_handler');
const moment = require('moment');
const jwt = require('jsonwebtoken');
moment.locale('tr');

/* GET roles listing. */
router.get('/', function (req, res, next) {
  CourseController.getCourses(function (result) {

    if (result.err) {
      ResponseHandler.returnDataBaseError(result.err, res);
    }
    else {
      ResponseHandler.returnJSONObject(res, result.result)
    }

  })
});

router.get('/getusercourses', function(req, res, next){

  const user_id = req.body.usertoken_id;
  CourseController.getUserCourses(user_id, function (result) {

    if (result.err) {
      ResponseHandler.returnDataBaseError(result.err, res);
    }
    else {
      ResponseHandler.returnJSONObject(res, result.result)
    }

  })
 

})

// Add course types.
router.post('/addcoursetype', [

  check('type_name').isLength({ min: 3 }),

], (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  // Validated.

  const { type_name } = req.body;

  CourseController.addCourseType(type_name, function (result) {

    if (result.err) {
      ResponseHandler.returnDataBaseError(result.err, res);
    }
    else {
      ResponseHandler.returnJSONObject(res, result.result);
    }

  })

});

router.delete('/deletecoursetype', [

  check('type_id').isInt(),

], (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  // Validated.

  const { type_id } = req.body;
  CourseController.deleteCourseType(type_id, function (result) {

    if (result.err) {
      ResponseHandler.returnDataBaseError(result.err, res);
    }
    else {
      ResponseHandler.returnJSONObject(res, result.message)
    }

  })

});

router.put('/updatecoursetype', [

  check('id').isInt(),
  check('type_name').isLength({ min: 3 })

], (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  // Validated.

  const { id, type_name } = req.body;
  CourseController.updateCourseType(id, type_name, function (result) {

    if (result.err) {
      ResponseHandler.returnDataBaseError(result.err, res);
    }
    else {
      ResponseHandler.returnJSONObject(res, result.message)
    }

  })



});

router.put('/updatecourse', [

  check('course_name').isLength({ min: 3 }),
  check('course_desc').isLength({ min: 3 }),
  check('course_goals').isLength({ min: 6 }),
  check('course_isprivate').isBoolean(),
  check('course_status').isBoolean(),
  check('course_id').isInt(),
  check('course_hasexam').isBoolean()

], (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  // Validated.

  const { course_name, course_desc, course_goals, course_id, course_status, course_isprivate, course_hasexam } = req.body;
  const course = {
    course_name: course_name,
    course_goals: course_goals,
    course_desc: course_desc,
    course_id: course_id,
    course_status: course_status,
    course_isPrivate: course_isprivate,
    course_hasexam: course_hasexam

  }
  CourseController.updateCourse(course, function (result) {
    if (result.err) {
      ResponseHandler.returnDataBaseError(result.err, res);
    }
    else {
      ResponseHandler.returnJSONObject(res, result);
    }
  });

});


// Get Course Types.

router.get('/getcoursetypes', function (req, res, next) {
  db.selectAll(req, res, config.tableNames.course_types);
});

router.get('/getcoursesbyword', [

  check('course_word').isLength({ min: 3 }),

], function(req, res, next){

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { course_word } = req.query;
  CourseController.getCoursesByWord(course_word, function (result) {

    if (result.err) {
      ResponseHandler.returnDataBaseError(result.err, res);
    }
    else {
      ResponseHandler.returnJSONObject(res, result.result)
    }

  })

})

router.get('/getcourseusers', [

  check('course_id').isInt(),

], function(req, res, next){

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { course_id } = req.query;
  CourseController.getCourseUsers(course_id, function (result) {

    if (result.err) {
      ResponseHandler.returnDataBaseError(result.err, res);
    }
    else {
      ResponseHandler.returnJSONObject(res, result.result)
    }

  })

})

router.get('/getusersforcourse', [

  check('course_id').isInt(),

], function(req, res, next){

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { course_id } = req.query;
  CourseController.getUsersForCourse(course_id, function (result) {

    if (result.err) {
      ResponseHandler.returnDataBaseError(result.err, res);
    }
    else {
      ResponseHandler.returnJSONObject(res, result.result)
    }

  })

})

// Add course to the system.
router.post('/addcourse', [

  check('course_name').isLength({ min: 3 }),
  check('course_desc').isLength({ min: 3 }),
  check('course_goals').isLength({ min: 6 }),
  check('course_type').isInt(),
  check('course_status').isBoolean(),
  check('course_hasExam').isBoolean(),
  check('course_isPrivate').isBoolean(),


], (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  // Validated.
  const time = moment().format();
  const course = {
    course_name: req.body.course_name,
    course_desc: req.body.course_desc,
    course_goals: req.body.course_goals,
    course_type: req.body.course_type,
    course_status: req.body.course_status,
    course_hasExam: req.body.course_hasExam,
    course_isPrivate: req.body.course_isPrivate,
    startDate: time,
    endDate: time
  }


  CourseController.addCourse(course, function (result) {
    if (result.err) {
      ResponseHandler.returnDataBaseError(result.err, res);
    }
    else {
      ResponseHandler.returnJSONObject(res, result.message)
    }
  })

});

router.post('/enrollrequest', [

  check('course_id').isInt(),


], (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const {course_id} = req.body;

  CourseController.enrollRequest(course_id, req.body.usertoken_id, function (result) {
    if (result.err) {
      ResponseHandler.returnDataBaseError(result.err, res);
    }
    else {
      ResponseHandler.returnJSONObject(res, result.message)
    }
  })

});

router.post('/acceptenrollrequest', [

  check('course_id').isInt(),
  check('user_id').isInt(),
  check('role_id').isInt()


], (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const {course_id, user_id, role_id} = req.body;

  const course_user = {
      course_id: course_id,
      user_id: user_id,
      role_id: role_id
  }

  CourseController.createCourseUser(course_user, function (result) {
    if (result.err) {
      ResponseHandler.returnDataBaseError(result.err, res);
    }
    else {

      CourseController.deleteEnrollRequest(course_id, user_id, function(result){
        if(result.err){
          ResponseHandler.returnDataBaseError(result.err, res);
        }
        else {
          ResponseHandler.returnJSONObject(res, result.message)
        }
      })

      
    }
  })

});

router.post('/denyenrollrequest', [

  check('course_id').isInt(),
  check('user_id').isInt(),


], (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const {course_id, user_id} = req.body;

  CourseController.deleteEnrollRequest(course_id, user_id, function(result){
    if(result.err){
      ResponseHandler.returnDataBaseError(result.err, res);
    }
    else {
      ResponseHandler.returnJSONObject(res, result.message)
    }
  })



});

router.post('/askquestion', [

  check('course_id').isInt(),
  check('course_questionheader').isLength({ min: 3 }),
  check('course_question').isLength({ min: 3 }),


], (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const {course_id, user_id} = req.body;

  CourseController.deleteEnrollRequest(course_id, user_id, function(result){
    if(result.err){
      ResponseHandler.returnDataBaseError(result.err, res);
    }
    else {
      ResponseHandler.returnJSONObject(res, result.message)
    }
  })



});

router.get('/getenrollrequests', [

  check('course_id').isInt(),

], function(req, res, next){

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { course_id } = req.query;
  CourseController.getEnrollRequests(course_id, function (result) {

    if (result.err) {
      ResponseHandler.returnDataBaseError(result.err, res);
    }
    else {
      ResponseHandler.returnJSONObject(res, result.result)
    }

  })

})

router.delete('/deletecourse', [

  check('course_id').isInt(),

], (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  // Validated.

  const { course_id } = req.body;
  CourseController.deleteCourse(course_id, function (result) {

    if (result.err) {
      ResponseHandler.returnDataBaseError(result.err, res);
    }
    else {
      ResponseHandler.returnJSONObject(res, result.message)
    }

  })

});

router.delete('/deletecourseuser', [

  check('course_id').isInt(),
  check('user_id').isInt()

], (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  // Validated.

  const { course_id, user_id } = req.body;
  CourseController.deleteCourseUser(course_id, user_id, function (result) {

    if (result.err) {
      ResponseHandler.returnDataBaseError(result.err, res);
    }
    else {
      ResponseHandler.returnJSONObject(res, result.message)
    }

  })

});

// Add Course Training Coordinator
router.post('/addcourseuser', [

  check('course_id').isInt(),
  check('user_id').isInt(),
  check('role_id').isInt()


], (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  // Validated.

  const { course_id, user_id, role_id } = req.body;

  const course_user = {
    course_id: course_id,
    user_id: user_id,
    role_id: role_id
  }

  CourseController.createCourseUser(course_user, function (result) {

    if (result.err) {
      ResponseHandler.returnSystemError(res);
    }
    else {
      ResponseHandler.returnJSONObject(res, result);
    }

  })

});

/*

// Set course active.
router.post('/setactive', [

  check('course_id').isInt(),


], (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  // Validated.

  const { course_id } = req.body;

  const query = {
    text: 'UPDATE course SET course_status = true where id = $1',
    values: [course_id]
  }

  // callback
  db.pool.query(query, (err, result) => {
    if (err) {
      console.log(err.stack)
    } else {
      res.send(result);
      console.log(result);
    }
  })

});

// Set course in-active.
router.post('/setinactive', [

  check('course_id').isInt(),


], (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  // Validated.

  const { course_id } = req.body;

  const query = {
    text: 'UPDATE course SET course_status = false where id = $1',
    values: [course_id]
  }

  // callback
  db.pool.query(query, (err, result) => {
    if (err) {
      console.log(err.stack)
    } else {
      res.send(result);
      console.log(result);
    }
  })

});

*/

module.exports = router;
