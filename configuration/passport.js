var LocalStrategy = require('passport-local').Strategy;

//Get the mongoose model
var User = require('../models/user.js');

module.exports = function (passport) {

    // Serialize the user for the duration of the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // Deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    //Signup handler
    passport.use('local-signup', new LocalStrategy({
            // Overriding username with phoneNumber as per the spec
            usernameField: 'phoneNumber',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {

            // asynchronousl; user.findOne wont fire unless data is sent back
            process.nextTick(function () {
                User.findOne({
                    'phoneNumber': email
                }, function (err, user) {
                    if (err) {
                        return done(err);
                    }

                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'Oh no! The user with this e-mail address already exists.'));
                    } else {
                        //Create the user
                        var newUser = new User();

                        // Set the user's local credentials
                        newUser.name = req.body.firstname;
                        newUser.surname = req.body.lastname;
                        newUser.password = newUser.generateHash(password);
                        newUser.phoneNumber = req.body.phoneNumber;

                        // Save the user
                        newUser.save(function (err) {
                            if (err) {
                                throw err;
                            }
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));

    //Login handler
    passport.use('local-login', new LocalStrategy({
            usernameField: 'phoneNumber',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, phone_number, password, done) {
            User.findOne({
                'phoneNumber': phone_number
            }, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, req.flash('loginMessage', 'Oh no! This user does not exist. (Sign up if you want to make an account)'));
                }
                if (!user.validPassword(password)) {
                    return done(null, false, req.flash('loginMessage', 'Oh no! The password is incorrect.'));
                }
                //handle happy-pass
                return done(null, user);
            });
        }));
};