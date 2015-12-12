// general purpose api

module.exports = function(app, passport){

	//home page
	app.get('/', function(req, res) {
	     res.redirect('/login');
	});

	//get login form
	app.get('/login', function(req, res) {
		res.render('../public/view/login.ejs', { message: req.flash('loginMessage') });
	});

	//handle login
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/todolist',
		failureRedirect : '/login',
		failureFlash : true
	}));

	//main page
	app.get('/todolist', isLoggedIn, function(req, res) {
		res.sendfile('./public/view/todolist.html', {
			user : req.user
		})
	});

    //handle registration
	app.get('/signup', function(req,res)
	{
		res.render('../public/view/signup.ejs', { message: req.flash('signupMessage') });
	});

	app.post('/signup', passport.authenticate('local-signup', {
         successRedirect : '/todolist',
         failureRedirect : '/signup',
         failureFlash : true
     }));

	app.get('/logout', function(req, res) {
		//redirect to home page on logout
		req.logout();
		res.redirect('/login');
	});
	
	//check if user is guest
	app.get('/*', isLoggedIn);

	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) {
			//handle logged user - carry on
			return next();
		} else {
			//handle guest - go to home page
			res.redirect('/');
		}
	}

};

