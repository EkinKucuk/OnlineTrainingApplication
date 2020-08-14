"use strict";

const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator/check');
const ExamController = require('../custom_modules/exam_operations');
const ResponseHandler = require('../custom_modules/response_handler');
const _ = require('lodash');

// Add course types.



router.get('/getexams', [

    check('course_id').isInt(),
  
], (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  // Validated.

  const { course_id } = req.query;
  ExamController.getExams(course_id, function (result) {

    if (result.err) {
      ResponseHandler.returnDataBaseError(result.err, res);
    }
    else {
      ResponseHandler.returnJSONObject(res, result)
    }

  })

});

router.get('/getquestions', [

  check('exam_id').isInt(),

], (req, res, next) => {

const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(422).json({ errors: errors.array() });
}
// Validated.

const { exam_id } = req.query;
ExamController.getQuestions(exam_id, function (result) {

  if (result.err) {
    ResponseHandler.returnDataBaseError(result.err, res);
  }
  else {

    const rows = result.rows;

    var grouped = _.values(_.groupBy(rows, 'question_id'));

    ResponseHandler.returnJSONObject(res, grouped)
  }

})

});
router.post('/createexam', [

    check('course_id').isInt(),
    check('exam_name').isLength({ min: 3 }),
    check('exam_description').isLength({ min: 3 }),

] ,(req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  // Validated.

  const { course_id, exam_name, exam_description} = req.body;
  
  //course_id, question, answers, correctanswer, question_type,callback

  ExamController.createExam(course_id, exam_name, exam_description, function (result) {

    if (result.err) {
      ResponseHandler.returnDataBaseError(result.err, res);
    }
    else {
      ResponseHandler.returnJSONObject(res, result);
    }

  })

});

router.post('/createquestion', [

  check('exam_id').isInt(),
  check('question_name').isLength({ min: 3 }),
  check('answer_description').isLength({ min: 3 }),
  check('answer1').isLength({ min: 1 }),
  check('answer2').isLength({ min: 1 }),
  check('answer3').isLength({ min: 1 }),
  check('answer4').isLength({ min: 1 }),
  check('correct_answer').isInt(),

] ,(req, res, next) => {

const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(422).json({ errors: errors.array() });
}
// Validated.

const question = {
  exam_id: req.body.exam_id,
  question_name: req.body.question_name,
  answer_description: req.body.answer_description,
};

const { answer1, answer2, answer3, answer4, correct_answer } = req.body;

ExamController.createQuestion(question, answer1, answer2, answer3, answer4, correct_answer, function (result) {

  if (result.err) {
    ResponseHandler.returnDataBaseError(result.err, res);
  }
  else {
    ResponseHandler.returnJSONObject(res, result.message);
  }

})

});

router.put('/editquestion', [

  check('question_id').isInt(),
  check('editAnswer1Id').isInt(),
  check('editAnswer2Id').isInt(),
  check('editAnswer3Id').isInt(),
  check('editAnswer4Id').isInt(),
  check('question_name').isLength({ min: 3 }),
  check('answer_description').isLength({ min: 3 }),
  check('answer1').isLength({ min: 1 }),
  check('answer2').isLength({ min: 1 }),
  check('answer3').isLength({ min: 1 }),
  check('answer4').isLength({ min: 1 }),
  check('correct_answer').isInt(),

] ,(req, res, next) => {

const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(422).json({ errors: errors.array() });
}
// Validated.

const question = {
  question_id: req.body.question_id,
  question_name: req.body.question_name,
  answer_description: req.body.answer_description,
};

const { answer1, answer2, answer3, answer4, correct_answer, editAnswer1Id, editAnswer2Id, editAnswer3Id, editAnswer4Id } = req.body;

ExamController.editQuestion(question, answer1, answer2, answer3, answer4, correct_answer, editAnswer1Id, editAnswer2Id, editAnswer3Id, editAnswer4Id, function (result) {

  if (result.err) {
    ResponseHandler.returnDataBaseError(result.err, res);
  }
  else {
    ResponseHandler.returnJSONObject(res, result.message);
  }

})

});

router.delete('/deleteexam', [

    check('exam_id').isInt(),
    check('course_id').isInt()
  ], (req, res, next) => {
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    // Validated.
  
    const { exam_id, course_id } = req.body;
    ExamController.deleteExam(exam_id, course_id, function(result) {
  
        if(result.err){
            ResponseHandler.returnDataBaseError(result.err, res);
        }
        else {
            ResponseHandler.returnJSONObject(res, result.message)
        }
  
    })
  
  });

  router.delete('/deletequestion', [

    check('exam_id').isInt(),
    check('question_id').isInt()
  ], (req, res, next) => {
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    // Validated.
  
    const { exam_id, question_id } = req.body;
    ExamController.deleteQuestion(exam_id, question_id, function(result) {
  
        if(result.err){
            ResponseHandler.returnDataBaseError(result.err, res);
        }
        else {
            ResponseHandler.returnJSONObject(res, result.message)
        }
  
    })
  
  });

  router.put('/updateexam', [

    check('exam_id').isInt(),
    check('course_id').isInt(),
    check('exam_name').isLength({ min: 3 }),
    check('exam_description').isLength({ min: 3 })
  
  ], (req, res, next) => {
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    // Validated.
  //quiz_id, question, answers,correctanswer, callback
    const { exam_id, course_id, exam_name, exam_description } = req.body;
    ExamController.updateExam(exam_id, course_id, exam_name, exam_description,function(result) {
  
        if(result.err){
            ResponseHandler.returnDataBaseError(result.err, res);
        }
        else {
            ResponseHandler.returnJSONObject(res, result.message)
        }
  
    })
  
});

module.exports=router;