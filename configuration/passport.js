var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user.js'); // get our mongoose model

module.exports = function(passport) {

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
      done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
          done(err, user);
      });
  });

  //local signup
  passport.use('local-signup', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with phone number
      usernameField : 'phoneNumber',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

      // asynchronous
      // User.findOne wont fire unless data is sent back
      process.nextTick(function() {
          User.findOne({ 'phoneNumber' :  email }, function(err, user) {
              // if there are any errors, return the error
              if (err)
                  return done(err);

              // check to see if theres already a user with that email
              if (user) {
                  return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
              } else {

                  // if there is no user with that email
                  // create the user
                  var newUser = new User();

                  // set the user's local credentials
                  newUser.name = req.body.firstname;
                  newUser.surname = req.body.lastname;
                  newUser.password = newUser.generateHash(password);
				          newUser.phoneNumber = req.body.phoneNumber;

                  // save the user
                  newUser.save(function(err) {
                      if (err)
                          throw err;
                      return done(null, newUser);
                  });
              }
          });
      });
  }));
  
  //user login
  passport.use('local-login', new LocalStrategy({
        usernameField : 'phoneNumber',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, phone_number, password, done) {
        User.findOne({ 'phoneNumber' :  phone_number }, function(err, user) {

            //return error, if any
            if (err)
                return done(err);

            //handle user not exist
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No such user. REgister if you don\'t have account'));

            //handle wrong password
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Wrong password'));

            //handle happy-pass
            return done(null, user);
        });
    }));
};
