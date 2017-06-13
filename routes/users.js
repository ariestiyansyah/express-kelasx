var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Include User, Student and Instructor Model
var User = require('../models/user');
var Student = require('../models/student');
var Instructor = require('../models/instructor');

// User registration
router.get('/register', function(req, res, next) {
  res.render('users/register');
});

// Register User
router.post('/register', function(req, res, next) {
  var first_name      = req.body.first_name;
  var last_name       = req.body.last_name;
  var street_address  = req.body.street_address;
  var city            = req.body.city;
  var state           = req.body.state;
  var zip             = req.body.zip;
  var email           = req.body.email;
  var username        = req.body.username;
  var password        = req.body.password;
  var password2       = req.body.password2;
  var type            = req.body.type;

  // Form Validation
  req.checkBody('first_name', 'Required').notEmpty();
  req.checkBody('last_name', 'Required').notEmpty();
  req.checkBody('email', 'Required').notEmpty();
  req.checkBody('email', 'Required').isEmail();
  req.checkBody('username', 'Required').notEmpty();
  req.checkBody('password', 'Required').notEmpty();
  req.checkBody('password2', 'Password do not match').equals(req.body.password)

  errors = req.validationErrors();
  if(errors) {
    res.render('users/register', {
      errors: errors
    });
  } else {
    var newUser = new User({
        email: email,
        username: username,
        password: password,
        type: type
    });
    if(type == 'student') {
      console.log('Registering Student...');
      var newStudent = new Student({
        first_name: first_name,
        last_name: last_name,
        address: [{
          street_address: street_address,
          city: city,
          state: state,
          zip: zip
        }],
        email: email,
        username: username
      });

      User.saveStudent(newUser, newStudent, function(err, user) {
        console.log('Student created');
      });
    } else {
      console.log('Registering Instructor...');
      var newInstructor = new Instructor({
        first_name: first_name,
        last_name: last_name,
        address: [{
          street_address: street_address,
          city: city,
          state: state,
          zip: zip
        }],
        email: email,
        username: username
      });

      User.saveInsructort(newUser, newInstructor, function(err, user) {
        console.log('Instructor created');
      });
    }

    req.flash('success_msg', 'User Added');
    res.redirect('/');
  }
});

module.exports = router;
