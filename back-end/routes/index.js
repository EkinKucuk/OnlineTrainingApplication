const express = require('express');
const bcrypt = require('bcryptjs');
const config = require('../bin/config');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator/check');
const ResponseHandler = require('../custom_modules/response_handler');
const CrudOperations = require('../custom_modules/crud_operations');
var nodemailer = require('nodemailer');
const fs = require('fs');
// Ci9MmzCgJVeSWG8

router.post('/login', [

  check('email').isLength({ min: 3 }),
  check('password').isLength({ min: 3 })

], (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  // Validated.

  const { email, password } = req.body;

  CrudOperations.checkIfUserExists(email, function (result) {

    if (result.err) {
      ResponseHandler.returnDataBaseError(result.err, res);
    }
    else if (result.user == null) {
      ResponseHandler.returnError(res, "Email veya şifre hatalıdır.");
    }
    else {

      bcrypt.compare(password, result.user.password, function (err, compareResult) {
        if (err) {
          ResponseHandler.returnSystemError(res);
        }
        else if (compareResult == true) {

          const user = result.user;
          jwt.sign(user, config.tokenKey, {
            expiresIn: '24h'
          }, (err, token) => {
            if (err) ResponseHandler.returnSystemError(res);
            else {
              res.json({
                success: true,
                token: token
              });
            }
          });

        }
        else {
          ResponseHandler.returnError(res, "Email veya şifre hatalıdır.");
        }
      });
    }

  })

});

router.post('/changepasswordrequest', [

  check('email').isEmail()

], (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  // Validated.

  const { email } = req.body;

  CrudOperations.checkIfUserExists(email, function (result) {

    if (result.err) {
      ResponseHandler.returnDataBaseError(result.err, res);
    }
    else if (result.user == null) {
      ResponseHandler.returnError(res, "Email does not exist.");
    }
    else {

      const email = result.user.email;

      jwt.sign(email, config.tokenKey, {

      }, (err, token) => {
        if (err) ResponseHandler.returnSystemError(res);
        else {

          var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'ctisteam7@gmail.com',
              pass: 'Ci9MmzCgJVeSWG8'
            }
          });
          
          var mailOptions = {
            from: 'ctisteam7@gmail.com',
            to: email,
            subject: 'Password Change - ICterra Online Training',
            text: 'Please enter this token to reset your password: ' + token
          };

          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
              ResponseHandler.returnSystemError(res);
            } else {
              console.log('Email sent: ' + info.response);

              res.json({
                success: true,
              });
            }
          });

          
        }
      });

    }

  })

});


router.get('/getvideodownload', [

], (req, res, next) => {

  const { path } = req.query;

  const data = fs.readFileSync('./back-end/videos/' + path);
  if (data){

    res.download('./back-end/videos/' + path, path, function(err){
      if (err) {
        // Handle error, but keep in mind the response may be partially-sent
        // so check res.headersSent
        console.log(err);
      } else {
        res.end();
        // decrement a download credit, etc.
      }
    });
  }
  else {
    ResponseHandler.returnError(res, "File not found.");
  }


});



router.get('/getvideo', function(req, res) {
  const filePath = req.query.path;
  const path = './back-end/videos/' + filePath
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] 
      ? parseInt(parts[1], 10)
      : fileSize-1
    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
});


router.get('/getpdf', [

], (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  // Validated.

  const { path } = req.query;

  const data = fs.readFileSync('./back-end/documents/' + path);
  if (data){
    res.contentType("application/pdf");
    res.send(data);
  }
  else {
    ResponseHandler.returnError(res, "File not found.");
  }


});


module.exports = router;
