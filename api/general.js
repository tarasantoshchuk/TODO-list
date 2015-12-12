//General-purpose API
var mongoose = require('mongoose');

module.exports = function (app, passport) {

    //Homepage: redirect to the login form first
    app.get('/', function (req, res) {
        res.redirect('/login');
    });

    //Get the login form
    app.get('/login', function (req, res) {
        res.render('../public/view/login.ejs', {
            message: req.flash('loginMessage')
        });
    });

    //Handle logging in
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/todolist',
        failureRedirect: '/login',
        failureFlash: true
    }));

    //Handle todo list page
    app.get('/todolist', isLoggedIn, function (req, res) {
        var notes = require('../models/notes');
        var mongoose = require('mongoose');
        var model = mongoose.model('Notes');
        var notelist = [];

        //Copy all notes into notelist
        model.find({}, function (err, notes) {
            notes.forEach(function (note) {
                notelist.push(note.note);
            })
        }).then(function () {
            res.render('../public/view/todolist.ejs', {
                user: req.user,
                notes: notelist
            })
        });
    });

    //Handle signup
    app.get('/signup', function (req, res) {
        res.render('../public/view/signup.ejs', {
            message: req.flash('signupMessage')
        });
    });

    //Handle signing up
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/todolist',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/logout', function (req, res) {
        //Redirect to the login page when logged out
        req.logout();
        res.redirect('/login');
    });

    //Checks if the user is logged in
    app.get('/*', isLoggedIn);

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/');
        }
    }
};