"use strict";

const express = require('express');
const router = express.Router();
const db = require('../custom_modules/db');
const config = require('../bin/config');
const { check, validationResult } = require('express-validator/check');
const CourseReviewController = require('../custom_modules/course_reviews');
const ResponseHandler = require('../custom_modules/response_handler');



// Add course types.
router.post('/addreview', [

  check('course_reviewheader').isLength({ min: 3 }),
  check('course_review').isLength({ min: 3 }),
  check('course_rating').isInt(),
  check('course_id').isInt(),

], (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  // Validated.

  const json = {
      course_reviewheader: req.body.course_reviewheader,
      course_review: req.body.course_review,
      course_rating: req.body.course_rating,
      course_id: req.body.course_id,
      user_id: req.body.usertoken_id
  }

  CourseReviewController.addReview(json, function (result) {

    if (result.err) {
      ResponseHandler.returnDataBaseError(result.err, res);
    }
    else {
      ResponseHandler.returnJSONObject(res, result.result);
    }

  })

});

router.get('/getuserreview', [

  check('course_id').isInt(),

], function(req, res, next){

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { course_id } = req.query;
  CourseReviewController.getReview(course_id, req.body.usertoken_id, function (result) {

    if (result.err) {
      ResponseHandler.returnDataBaseError(result.err, res);
    }
    else {
      ResponseHandler.returnJSONObject(res, result.result)
    }

  })

})

router.get('/getallreviews', [

  check('course_id').isInt(),

], function(req, res, next){

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { course_id } = req.query;
  CourseReviewController.getAllReviews(course_id, function (result) {

    if (result.err) {
      ResponseHandler.returnDataBaseError(result.err, res);
    }
    else {
      ResponseHandler.returnJSONObject(res, result.result)
    }

  })

})

router.delete('/deletecoursereview', [

  check('course_id').isInt(),

], (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  // Validated.

  const { course_id } = req.body;
  CourseReviewController.deleteReview(course_id, req.body.usertoken_id, function (result) {

    if (result.err) {
      ResponseHandler.returnDataBaseError(result.err, res);
    }
    else {
      ResponseHandler.returnJSONObject(res, result.message)
    }

  })

});

router.put('/updatereview', [

  check('course_reviewheader').isLength({ min: 3 }),
  check('course_review').isLength({ min: 3 }),
  check('course_rating').isInt(),
  check('course_id').isInt(),

], (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  // Validated.

  const json = {
    course_reviewheader: req.body.course_reviewheader,
    course_review: req.body.course_review,
    course_rating: req.body.course_rating,
    course_id: req.body.course_id,
    user_id: req.body.usertoken_id
}

  CourseReviewController.updateReview(json, function (result) {

    if (result.err) {
      ResponseHandler.returnDataBaseError(result.err, res);
    }
    else {
      ResponseHandler.returnJSONObject(res, result.message)
    }

  })



});


module.exports = router;
