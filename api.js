//all api should be included here
module.exports = function(app, passport){
  require('./api/general.js')(app, passport);
  require('./api/todolist.js')(app);
}