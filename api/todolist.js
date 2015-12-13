//To-Do List API
var notes = require('../models/notes');
var mongoose = require('mongoose');
var Note = mongoose.model('Notes');

module.exports = function (app, passport) {

    //Handle note addition

    app.post('/todo/:value', function (req, res) {
        var value = req.params.value;
        var newnote = new Note({
            note: value
        });
        newnote.save(function (err) {
            if (err) {
                handleError(res, err);
            }
            res.send("Successfully added user!");
        })
    });
	
	app.delete('/todo/:value', function (req, res) {
        Note.remove({
            note: req.params.value
        }, function (err) {
            if (err) {
                handleError(res, err);
            }
            res.send("Successfully deleted note!");
        })
    });
};